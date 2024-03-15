import * as React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import {  Node } from "../Sidebar";
import { Category } from "../../../pages/Home";

interface ContentNodeProps {
  node: Node;
  handleCategory?: (category: Category) => void;
}

const ContentNode: React.FC<ContentNodeProps> = ({ node, handleCategory }) => {
  const [toggle, setToggle] = React.useState(false);

  const handleToggle = () => {
    if (handleCategory) {
      handleCategory(node.data);
    }
    if (node.children.length) {
      setToggle((toggle) => !toggle);
    }
  };
  return (
    <div className="mb-1">
      <div
        className="flex items-center cursor-pointer mb-1"
        onClick={handleToggle}
      >
        {toggle ? (
          <AiFillFolderOpen className="mr-1 h-5 w-5 text-[#e23770]" />
        ) : (
          <AiFillFolder className="mr-1 h-5 w-5 text-[#e23770]" />
        )}

        <span>{node.data.name}</span>
      </div>
      {toggle && node.children && (
        <div className="pl-2">
          {node.children.map((child, index) => (
            <ContentNode
              handleCategory={handleCategory}
              key={index}
              node={child}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentNode;
