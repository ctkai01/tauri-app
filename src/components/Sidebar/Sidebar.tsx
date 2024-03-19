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
  UpdateCategory,
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
    const fetchCategories = async() => {
      const categoryData: Category[] = await invoke("get_categories");
      console.log(categoryData);
      setCategories(categoryData);
    }
    fetchCategories()
  }, [])

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
    parentId: string,
    newCategory: Category,
    categories: Category[]
  ): Category[] => {
    if (!parentId || parentId === "") {
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
          children: addCategoryToChildren(parentId, newCategory, category.children),
        };
      }
      return category;
    });
  };

  const deleteCategory = (
    categories: Category[],
    idToDelete: string
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
    console.log("catch");
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

  function updateCategory(
    categories: Category[],
    id: string,
    updatedCategory: UpdateCategory
  ): Category[] {
    return categories.map((c) => {
      if (c.id === id) {
        // If the current node matches the ID, update its data
        return { ...c, ...updatedCategory };
      } else if (c.children.length > 0) {
        // If the current node has children, recursively update them
        return {
          ...c,
          children: updateCategory(c.children, id, updatedCategory),
        };
      } else {
        // If the current node does not match the ID and has no children, return it unchanged
        return c;
      }
    });
  }
  console.log("categoryChose: ", categoryChose);
  const handleAddCategory = (data: CreateCategory) => {
    try {
      const newID = `${categoryChose ? categoryChose.id : ""}${data.id}`;
      console.log("New ID: ", newID);
      console.log("data.id ", data.id);
      const parentID = categoryChose ? categoryChose.id : "";

      const dataSend: CreateCategoryToServer = {
        category_id: categoryChose ? categoryChose.id : null,
        id: newID,
        name: data.name,
      };
      const now = new Date();

      // Format the current date and time as a string
      const formattedDateTime = now.toISOString().replace('T', ' ').slice(0, 19);
      invoke("create_category", { data: JSON.stringify(dataSend) });
      const newCategory: Category = {
        id: newID,
        name: data.name,
        parent_id: parentID,
        created_at: formattedDateTime,
        children: [],
      };
      const updatedCategories = addCategoryToChildren(
        parentID,
        newCategory,
        categories
      );
      setCategories(updatedCategories);
    } catch (err: any) {
      console.log("Error:", err);
    }
  };

  const handleUpdateCategory = (data: UpdateCategory) => {
    if (categoryChose) {
      const updatedCategory: UpdateCategory = {
        id: data.id ? data.id : categoryChose?.id,
        name: data.name ? data.name : categoryChose?.name,
      };

      console.log("updatedCategory: ", updatedCategory);
      const updatedCategories = updateCategory(
        categories,
        categoryChose.id,
        updatedCategory
      );
      setCategories(updatedCategories);
      // handleSetCategoryChose(updatedCategory);
    }
  };

  const handleDeleteCategory = () => {
    if (categoryChose) {
      setCategories((prevCategories) =>
        deleteCategory(prevCategories, categoryChose.id)
      );
      handleActionDeleteCategoryModal(false);
    }
  };
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
            // onClick={() => handleSetCategoryChose(null)}
            onClick={async () => {
              console.log("hey");
              await invoke("greet", {
                name: "Nam",
              });
            }}
          >
            <GrPowerReset />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
