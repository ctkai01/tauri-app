import {
  Button,
  CustomFlowbiteTheme,
  Flowbite,
  Modal,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Product } from "../../../models";

export interface IDeleteProductModalProps {
  isOpen: boolean;

  handleModal: (state: boolean, product?: Product) => void;
  handleDeleteProduct: () => void;
}

const customThemeModal: CustomFlowbiteTheme = {
  modal: {
    body: {
      base: "p-6 flex-1",
      popup: "pt-0",
    },
  },
};

export default function DeleteProductModal(props: IDeleteProductModalProps) {
  const { isOpen, handleModal, handleDeleteProduct } = props;

  return (
    <Flowbite theme={{ theme: customThemeModal }}>
      <Modal show={isOpen} size="md" onClose={() => handleModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắn chắn muốn xóa hàng hóa này ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteProduct()}>
                Chắn chắn
              </Button>
              <Button color="gray" onClick={() => handleModal(false)}>
                Hủy bỏ
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
}
