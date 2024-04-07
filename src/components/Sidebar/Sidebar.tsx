import { Button, Tooltip } from "flowbite-react";
import * as React from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddCategoryModal from "../Modal/Category/AddCategoryModal";
import ContentNode from "./ContentNode/ContentNode";
import {
  CreateCategory,
  CreateCategoryToServer,
  DeleteCategoryToServer,
  UpdateCategory,
  UpdateCategoryToServer,
} from "../../models";
import UpdateCategoryModal from "../Modal/Category/UpdateCategoryModal";
import { toast } from "react-toastify";
import { GrPowerReset } from "react-icons/gr";
import DeleteCategoryModal from "../Modal/Category/DeleteCategoryModal ";
import { Category } from "../../pages/Home";
import { invoke } from "@tauri-apps/api/tauri";

export interface ISidebarProps {
  categoryChose: Category | null;
  handleSetCategoryChose: (category: Category | null) => void;
}

// export interface Node {
//   data: Category;
//   children: Node[];
// }

// const data: Node[] = [
//   {
//     data: {
//       id: "TS",
//       name: "Trang suc",
//     },
//     children: [
//       {
//         data: {
//           id: "TSN",
//           name: "Nhan",
//         },
//         children: [
//           {
//             data: {
//               id: "TSNN",
//               name: "Trang suc nhan nam",
//             },
//             children: [],
//           },
//         ],
//       },
//       {
//         data: {
//           id: "TSD",
//           name: "Day",
//         },
//         children: [
//           {
//             data: {
//               id: "TSDVT",
//               name: "Day vang trang",
//             },
//             children: [],
//           },
//         ],
//       },
//     ],
//   },
// ];

export default function Sidebar(props: ISidebarProps) {
  const { categoryChose, handleSetCategoryChose } = props;
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const categoryData: Category[] = await invoke("get_categories");
      // console.log(categoryData);
      setCategories(categoryData);
    };
    fetchCategories();
  }, []);

  const [openAddCategoryModal, setOpenAddCategoryModal] = React.useState(false);
  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] =
    React.useState(false);

  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] =
    React.useState(false);

  function handleActionAddCategoryModal(state: boolean) {
    setOpenAddCategoryModal(state);
  }

  function handleActionUpdateCategoryModal(state: boolean) {
    setOpenUpdateCategoryModal(state);
  }

  function handleActionDeleteCategoryModal(state: boolean) {
    setOpenDeleteCategoryModal(state);
  }

  const handleCategory = (category: Category) => {
    handleSetCategoryChose(category);
  };

  const addCategoryToChildren = (
    parentId: number | null,
    newCategory: Category,
    categories: Category[]
  ): Category[] => {
    if (!parentId) {
      return [...categories, newCategory]; // Add newNode to the root
    }
    return categories.map((category) => {
      if (category.id === parentId) {
        return {
          ...category,
          children: [...category.children, newCategory],
        };
      } else if (category.children.length > 0) {
        return {
          ...category,
          children: addCategoryToChildren(
            parentId,
            newCategory,
            category.children
          ),
        };
      }
      return category;
    });
  };

  const deleteCategory = (
    categories: Category[],
    idToDelete: number
  ): Category[] => {
    return categories.reduce((acc: Category[], category: Category) => {
      // Check if the current node's ID matches the ID to delete
      if (category.id === idToDelete) {
        // Skip this node and its children (effectively deleting it)
        return acc;
      } else {
        // Keep this node and its children
        const updatedChildren = deleteCategory(category.children, idToDelete);
        return [
          ...acc,
          {
            ...category,
            children: updatedChildren,
          },
        ];
      }
    }, []);
  };

  React.useEffect(() => {
    // console.log("catch");
    if (
      !categoryChose &&
      (openUpdateCategoryModal || openDeleteCategoryModal)
    ) {
      toast(<div className="font-bold">Vui lòng chọn nhóm hàng</div>, {
        draggable: false,
        position: "top-right",
        type: "warning",
      });
      handleActionDeleteCategoryModal(false);
      handleActionUpdateCategoryModal(false);
    }
  }, [categoryChose, openUpdateCategoryModal, openDeleteCategoryModal]);

  // function updateCategory(
  //   categories: Category[],
  //   id: number,
  //   updatedCategory: UpdateCategory
  // ): Category[] {
  //   return categories.map((c) => {
  //     if (c.id === id) {
  //       // If the current node matches the ID, update its data
  //       return { ...c, ...updatedCategory };
  //     } else if (c.children.length > 0) {
  //       // If the current node has children, recursively update them
  //       return {
  //         ...c,
  //         children: updateCategory(c.children, id, updatedCategory),
  //       };
  //     } else {
  //       // If the current node does not match the ID and has no children, return it unchanged
  //       return c;
  //     }
  //   });
  // }

  console.log("categoryChose: ", categoryChose);
  const handleAddCategory = async (data: CreateCategory) => {
    try {
      // const newID = `${categoryChose ? categoryChose.id : ""}${data.code}`;
      // console.log("New ID: ", newID);
      // console.log("data.id ", data.code);
      const parentID = categoryChose ? categoryChose.id : null;

      const dataSend: CreateCategoryToServer = {
        parent_id: categoryChose ? categoryChose.id : 0,
        code: data.code,
        name: data.name,
      };
      const now = new Date();

      // Format the current date and time as a string
      const formattedDateTime = now
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);
      let newID: number = await invoke("create_category", {
        data: JSON.stringify(dataSend),
      });
      const newCategory: Category = {
        id: newID,
        name: data.name,
        parent_id: parentID,
        code: data.code,
        created_at: formattedDateTime,
        children: [],
      };
      const updatedCategories = addCategoryToChildren(
        parentID,
        newCategory,
        categories
      );
      handleSetCategoryChose(null);
      setCategories(updatedCategories);
    } catch (err: any) {
      console.log("Error:", err);
    }
  };

  // const updateCategory = (categories: Category[], updateData: UpdateCategory) => {

  //     // Map over the categories array to update the target category
  //     const updatedCategories = categories.map((category) => {
  //       if (category.id === updateData.id) {
  //         // Update the target category with the updated data
  //         return { ...category, ...updateData };
  //       }

  //       if (category.children.length) {
  //         updateCategory(category.children, updateData);
  //       }
  //       return category;
  //     });

  //     console.log("Update in: ", updatedCategories);
  //     return updatedCategories;
  //     // Update the children of the parent category if parent_id has changed
  //     // if (updateData.parent_id !== undefined && updateData.parent_id !== null) {
  //     //   return updatedCategories.map((category) => {
  //     //     if (category.id === updateData.parent_id) {
  //     //       // Add the updated category as a child to the parent category
  //     //       category.children.push({
  //     //         ...updateData,
  //     //         created_at: category.created_at,
  //     //         children: [],
  //     //       });
  //     //     }
  //     //     return category;
  //     //   });
  //     // }
  // };

  const handleUpdateCategory = async (data: UpdateCategory) => {
    try {
      if (categoryChose) {
        const updatedCategory: UpdateCategory = {
          id: categoryChose.id,
          code: data.code,
          name: data.name ? data.name : categoryChose?.name,
          parent_id: data.parent_id,
        };

        console.log("updatedCategory: ", updatedCategory);
        // updateCategory(categories, updatedCategory);
        // const updatedCategories = updateCategory(
        //   categories,
        //   categoryChose.id,
        //   updatedCategory
        // );

        // console.log("updatedCategories 1: ", updatedCategories);
        const dataUpdate: UpdateCategoryToServer = {
          code: data.code,
          parent_id: data.parent_id ? data.parent_id : 0,
          id: data.id ? data.id : categoryChose?.id,
          name: data.name ? data.name : categoryChose?.name,
        };
        await invoke("update_category", { data: JSON.stringify(dataUpdate) });
        // setCategories(updatedCategories);
        const categoryData: Category[] = await invoke("get_categories");
        setCategories(categoryData);
        handleSetCategoryChose(null);
        toast(<div className="font-bold">Cập nhật nhóm hàng thành công</div>, {
          draggable: false,
          position: "top-right",
          type: "success",
        });
      }
    } catch (err) {
      toast(<div className="font-bold">Có lỗi cập nhật</div>, {
        draggable: false,
        position: "top-right",
        type: "error",
      });
    }
  };

  const handleDeleteCategory = async() => {
    if (categoryChose) {
      const dataDelete: DeleteCategoryToServer = {
       id: categoryChose.id
      };
      await invoke("delete_category", {
        data: JSON.stringify(dataDelete),
      });
      const categoryData: Category[] = await invoke("get_categories");
      setCategories(categoryData);
      // setCategories((prevCategories) =>
      //   deleteCategory(prevCategories, categoryChose.id)
      // );
      handleSetCategoryChose(null);
      handleActionDeleteCategoryModal(false);
    }
  };

  // console.log("Categories: ", categories);
  return (
    <div className="flex flex-col h-full">
      <AddCategoryModal
        isOpen={openAddCategoryModal}
        categoryChose={categoryChose}
        handleModal={handleActionAddCategoryModal}
        handleAddCategory={handleAddCategory}
      />
      {categoryChose && openUpdateCategoryModal && (
        <UpdateCategoryModal
          isOpen={openUpdateCategoryModal}
          categoryChose={categoryChose}
          handleModal={handleActionUpdateCategoryModal}
          handleUpdateCategory={handleUpdateCategory}
        />
      )}

      {categoryChose && openDeleteCategoryModal && (
        <DeleteCategoryModal
          isOpen={openDeleteCategoryModal}
          handleModal={handleActionDeleteCategoryModal}
          handleDeleteCategory={handleDeleteCategory}
        />
      )}

      <div className="p-2 text-xs h-16">
        <p>Nhóm hàng</p>
        <p>
          Nhóm hàng đang được chọn:{" "}
          <span className="font-bold">{categoryChose?.name}</span>
        </p>
      </div>
      <div className="p-3 border-[4px] bg-white  flex-grow">
        {categories.map((category, index) => (
          <ContentNode
            key={index}
            handleCategory={handleCategory}
            category={category}
          />
        ))}
      </div>
      <div
        className="py-2 flex flex-wrap justify-center
      gap-2"
      >
        <Tooltip content="Thêm nhóm hàng">
          <Button
            className="mr-1"
            color="success"
            onClick={() => handleActionAddCategoryModal(true)}
          >
            <FaPlus />
          </Button>
        </Tooltip>
        <Tooltip content="Cập nhật nhóm hàng">
          <Button
            className="mr-1"
            onClick={() => handleActionUpdateCategoryModal(true)}
          >
            <BsFillPencilFill />
          </Button>
        </Tooltip>
        <Tooltip content="Xóa nhóm hàng">
          <Button
            className="mr-1"
            color="failure"
            onClick={() => setOpenDeleteCategoryModal(true)}
          >
            <MdDelete />
          </Button>
        </Tooltip>
        <Tooltip content="Bỏ chọn nhóm hàng">
          <Button
            className="mr-1"
            color="dark"
            onClick={() => handleSetCategoryChose(null)}
            // onClick={async () => {
            //   console.log("hey");
            //   await invoke("greet", {
            //     name: "Nam",
            //   });
            // }}
          >
            <GrPowerReset />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
