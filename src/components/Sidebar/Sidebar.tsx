import { Button } from "flowbite-react";
import * as React from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddCategoryModal from "../Modal/AddCategoryModal";
import ContentNode from "./ContentNode/ContentNode";
import { CreateCategory, UpdateCategory } from "../../models";
import UpdateCategoryModal from "../Modal/UpdateCategoryModal";

export interface ISidebarProps {}

export interface Node {
  data: Category;
  children: Node[];
}

export interface Category {
  name: string;
  id: string;
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
  const [categoryChose, setCategoryChose] = React.useState<Category | null>(
    null
  );

  const [categories, setCategories] = React.useState<Node[]>(data);

  const [openAddCategoryModal, setOpenAddCategoryModal] = React.useState(false);
  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] =
    React.useState(false);

  function handleActionAddCategoryModal(state: boolean) {
    setOpenAddCategoryModal(state);
  }

  function handleActionUpdateCategoryModal(state: boolean) {
    setOpenUpdateCategoryModal(state);
  }

  const handleCategory = (category: Category) => {
    setCategoryChose(category);
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
  console.log("categoryChose: ", categoryChose);
  const handleAddCategory = (data: CreateCategory) => {
    const newID = `${categoryChose ? categoryChose.id : ""}${data.id}`;
    console.log("New ID: ", newID);
    console.log("data.id ", data.id);
    const newNode: Node = {
      data: {
        id: newID,
        name: data.name,
      },
      children: [],
    };
    const parentID = categoryChose ? categoryChose.id : "";
    const updatedCategories = addNodeToChildren(parentID, newNode, categories);
    setCategories(updatedCategories);
  };

  const handleUpdateCategory = (data: UpdateCategory) => {
    // const newNode: Node = {
    //   data: {
    //     id: data.id,
    //     name: data.name,
    //   },
    //   children: [],
    // };
    // const parentID = categoryChose ? categoryChose.id : "";
    // const updatedCategories = addNodeToChildren(parentID, newNode, categories);
    // setCategories(updatedCategories);
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
        <UpdateCategoryModal
          isOpen={openUpdateCategoryModal}
          categoryChose={categoryChose}
          handleModal={handleActionUpdateCategoryModal}
          handleUpdateCategory={handleUpdateCategory}
        />
      )}

      <div className="p-2 text-xs h-16">
        <p>Nhóm hàng</p>
        <p>
          Nhóm hàng đang được chọn:{" "}
          <span className="font-bold">{categoryChose?.name}</span>
        </p>
      </div>
      <div className="p-3 border-[2px] bg-white  flex-grow">
        {categories.map((node, index) => (
          <ContentNode
            key={index}
            handleCategory={handleCategory}
            node={node}
          />
        ))}
      </div>
      <div className="py-2 flex ">
        <Button
          className="mr-1"
          color="success"
          onClick={() => handleActionAddCategoryModal(true)}
        >
          <FaPlus />
        </Button>

        <Button
          className="mr-1"
          onClick={() => handleActionUpdateCategoryModal(true)}
        >
          <BsFillPencilFill />
        </Button>
        <Button className="mr-1" color="failure">
          <MdDelete />
        </Button>
      </div>
    </div>
  );
}
