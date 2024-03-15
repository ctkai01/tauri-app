import { Button, Tooltip } from "flowbite-react";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import AddProductModal from "../Modal/Product/AddProductModal";
import TableContent from "./TableContent";
import { Category } from "../../pages/Home";

export interface IHomeActionProps {
  categoryChose: Category | null;
}

export default function HomeAction(props: IHomeActionProps) {
  const { categoryChose  } = props;
  const [openAddProductModal, setOpenAddProductModal] = React.useState(false);
  function handleActionAddProductModal(state: boolean) {
    setOpenAddProductModal(state);
  }

  return (
    <div className="flex flex-col h-full">
      {openAddProductModal && (
        <AddProductModal
          isOpen={openAddProductModal}
          categoryChose={categoryChose}
          handleModal={handleActionAddProductModal}
        />
      )}

      <div className="p-2 text-xs h-16">
        <p>Hàng hóa</p>
        <div className="flex justify-end">
          <Tooltip content="Thêm hàng hóa">
            <Button
              color="success"
              onClick={() => handleActionAddProductModal(true)}
            >
              <FaPlus />
            </Button>
          </Tooltip>
        </div>
        {/* <p>
          Nhóm hàng đang được chọn:{" "}
        </p> */}
      </div>
      <div className="p-3 border-[4px] bg-white  flex-grow">
        <TableContent />
      </div>
    </div>
  );
}
