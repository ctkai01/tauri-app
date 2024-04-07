import * as React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HomeAction from "../components/Home/HomeAction";

export interface IHomeProps {}
export interface Category {
  name: string;
  id: number;
  code: string;
  parent_id: number;
  created_at: string;
  children: Category[];
}
export default function Home(props: IHomeProps) {
  const [categoryChose, setCategoryChose] = React.useState<Category | null>(
    null
  );

  const handleSetCategoryChose = (category: Category | null) => {
    setCategoryChose(category);
  };
  return (
    <div className="h-screen">
      <div className="flex h-full text-xs bg-gray-100 pl-4">
        <div className="w-[20%]">
          <Sidebar
            categoryChose={categoryChose}
            handleSetCategoryChose={handleSetCategoryChose}
          />
        </div>
        <div className="w-[80%]">
          <HomeAction categoryChose={categoryChose} />
        </div>
      </div>
    </div>
  );
}
