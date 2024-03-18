import * as React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import { Category } from "../../../pages/Home";

interface ContentNodeProps {
  category: Category;
  handleCategory?: (category: Category) => void;
}

const ContentNode: React.FC<ContentNodeProps> = ({
  category,
  handleCategory,
}) => {
  const [toggle, setToggle] = React.useState(false);

  const handleToggle = () => {
    if (handleCategory) {
      handleCategory(category);
    }
    if (category.children.length) {
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

        <span>{category.name}</span>
      </div>
      {toggle && category.children && (
        <div className="pl-2">
          {category.children.map((child, index) => (
            <ContentNode
              handleCategory={handleCategory}
              key={index}
              category={child}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentNode;
