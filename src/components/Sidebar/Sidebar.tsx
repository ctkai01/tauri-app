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

export interface Node {
  data: Category;
  children: Node[];
}

const data: Node[] = [
  {
    data: {
      id: "TS",
      name: "Trang suc",
    },
    children: [
      {
        data: {
          id: "TSN",
          name: "Nhan",
        },
        children: [
          {
            data: {
              id: "TSNN",
              name: "Trang suc nhan nam",
            },
            children: [],
          },
        ],
      },
      {
        data: {
          id: "TSD",
          name: "Day",
        },
        children: [
          {
            data: {
              id: "TSDVT",
              name: "Day vang trang",
            },
            children: [],
          },
        ],
      },
    ],
  },
];

export default function Sidebar(props: ISidebarProps) {
  const { categoryChose, handleSetCategoryChose } = props;
  const [categories, setCategories] = React.useState<Node[]>(data);

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

  const addNodeToChildren = (
    parentId: string,
    newNode: Node,
    nodes: Node[]
  ): Node[] => {
    if (!parentId || parentId === "") {
      return [...nodes, newNode]; // Add newNode to the root
    }
    return nodes.map((node) => {
      if (node.data.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      } else if (node.children.length > 0) {
        return {
          ...node,
          children: addNodeToChildren(parentId, newNode, node.children),
        };
      }
      return node;
    });
  };

  const deleteNode = (nodes: Node[], idToDelete: string): Node[] => {
    return nodes.reduce((acc: Node[], node: Node) => {
      // Check if the current node's ID matches the ID to delete
      if (node.data.id === idToDelete) {
        // Skip this node and its children (effectively deleting it)
        return acc;
      } else {
        // Keep this node and its children
        const updatedChildren = deleteNode(node.children, idToDelete);
        return [
          ...acc,
          {
            ...node,
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

  function updateNode(
    nodes: Node[],
    id: string,
    updatedCategory: Category
  ): Node[] {
    return nodes.map((n) => {
      if (n.data.id === id) {
        // If the current node matches the ID, update its data
        return { ...n, data: updatedCategory };
      } else if (n.children.length > 0) {
        // If the current node has children, recursively update them
        return { ...n, children: updateNode(n.children, id, updatedCategory) };
      } else {
        // If the current node does not match the ID and has no children, return it unchanged
        return n;
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

      invoke("create_category", { data: JSON.stringify(dataSend) });
      const newNode: Node = {
        data: {
          id: newID,
          name: data.name,
        },
        children: [],
      };
      const updatedCategories = addNodeToChildren(
        parentID,
        newNode,
        categories
      );
      setCategories(updatedCategories);
    } catch (err: any) {
      console.log("Error:", err);
    }
  };

  const handleUpdateCategory = (data: UpdateCategory) => {
    if (categoryChose) {
      const updatedCategory: Category = {
        id: data.id ? data.id : categoryChose?.id,
        name: data.name ? data.name : categoryChose?.name,
      };

      console.log("updatedCategory: ", updatedCategory);
      const updatedCategories = updateNode(
        categories,
        categoryChose.id,
        updatedCategory
      );
      setCategories(updatedCategories);
      handleSetCategoryChose(updatedCategory);
    }
  };

  const handleDeleteCategory = () => {
    if (categoryChose) {
      setCategories((prevCategories) =>
        deleteNode(prevCategories, categoryChose.id)
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
      {categoryChose && (
        <>
          <UpdateCategoryModal
            isOpen={openUpdateCategoryModal}
            categoryChose={categoryChose}
            handleModal={handleActionUpdateCategoryModal}
            handleUpdateCategory={handleUpdateCategory}
          />
          <DeleteCategoryModal
            isOpen={openDeleteCategoryModal}
            handleModal={handleActionDeleteCategoryModal}
            handleDeleteCategory={handleDeleteCategory}
          />
        </>
      )}

      <div className="p-2 text-xs h-16">
        <p>Nhóm hàng</p>
        <p>
          Nhóm hàng đang được chọn:{" "}
          <span className="font-bold">{categoryChose?.name}</span>
        </p>
      </div>
      <div className="p-3 border-[4px] bg-white  flex-grow">
        {categories.map((node, index) => (
          <ContentNode
            key={index}
            handleCategory={handleCategory}
            node={node}
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
