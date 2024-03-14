import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CustomFlowbiteTheme,
  Flowbite,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { CreateCategory } from "../../models";
import { schemeCreateCategory } from "../../validators";
import { toast } from "react-toastify";
import { Category } from "../Sidebar/Sidebar";

export interface IAddCategoryModalProps {
  isOpen: boolean;
  categoryChose: Category | null
  handleModal: (state: boolean) => void;
  handleAddCategory: (data: CreateCategory) => void;
}

const customThemeModal: CustomFlowbiteTheme = {
  modal: {
    body: {
      base: "p-6 flex-1",
      popup: "pt-0",
    },
  },
};

export default function AddCategoryModal(props: IAddCategoryModalProps) {
  const { isOpen, categoryChose, handleModal, handleAddCategory } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategory>({
    mode: "onChange",
    resolver: yupResolver(schemeCreateCategory),
  });
  const onSubmit = (data: CreateCategory) => {
    console.log(data);
    handleAddCategory(data)
    reset()
     toast(<div className="font-bold">Thêm mới nhóm hàng thành công</div>, {
       draggable: false,
       position: "top-right",
       type: "success",
     });


    handleModal(false);
  };
  return (
    <Flowbite theme={{ theme: customThemeModal }}>
      <Modal
        dismissible
        show={isOpen}
        size="xl"
        onClose={() => handleModal(false)}
        popup
      >
        <Modal.Header>
          <p className="text-sm font-bold ">Thêm mới nhóm hàng</p>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" max-w-md flex-col gap-4"
          >
            <div className="mb-4">
              <div className="flex items-center ">
                <div className="mb-2 min-w-[115px]">
                  <Label
                    htmlFor="category_id"
                    className=" block"
                    value="Mã nhóm hàng"
                  />
                </div>
                <div className="flex items-center">
                  <TextInput
                    type="text"
                    className="flex-1"
                    disabled
                    placeholder={categoryChose ? categoryChose.id : ""}
                  />
                  <span className="mx-1">+</span>
                  <TextInput
                    id="category_id"
                    type="text"
                    className="flex-1"
                    color={errors.id ? "failure" : ""}
                    {...register("id")}
                  />
                </div>
              </div>
              {errors.id ? (
                <div className="text-red-500 text-sm mt-1">
                  <span>{errors.id.message}</span>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className=" mb-4">
              <div className="flex items-center">
                <div className="mb-2 min-w-[115px]">
                  <Label
                    htmlFor="name_category"
                    className=" block"
                    value="Tên nhóm hàng"
                  />
                </div>
                <TextInput
                  id="name_category"
                  type="text"
                  placeholder=""
                  className="flex-1"
                  color={errors.name ? "failure" : ""}
                  {...register("name")}
                />
              </div>

              {errors.name ? (
                <div className="text-red-500 text-sm mt-1">
                  <span>{errors.name.message}</span>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="flex items-center mb-4">
              <div className="mb-2 min-w-[115px]">
                <Label htmlFor="parent_id" className=" block" value="Nhóm mẹ" />
              </div>
              <TextInput
                id="parent_id"
                type="text"
                placeholder={categoryChose ? categoryChose.id : ""}
                className="flex-1"
                disabled
              />
            </div>
            <div className="flex text-xs justify-center gap-4 mt-3">
              <Button size="sm" color="success" type="submit">
                Thêm
              </Button>
              <Button size="sm" color="gray" onClick={() => handleModal(false)}>
                Hủy bỏ
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
}
