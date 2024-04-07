import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CustomFlowbiteTheme,
  Flowbite,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UpdateCategory } from "../../../models";
import { schemeUpdateCategory } from "../../../validators";
import { useEffect, useState } from "react";
import { Category } from "../../../pages/Home";
import { invoke } from "@tauri-apps/api";

export interface IUpdateCategoryModalProps {
  isOpen: boolean;
  categoryChose: Category;

  handleModal: (state: boolean) => void;
  handleUpdateCategory: (data: UpdateCategory) => void;
}

const customThemeModal: CustomFlowbiteTheme = {
  modal: {
    body: {
      base: "p-6 flex-1",
      popup: "pt-0",
    },
  },
};

export default function UpdateCategoryModal(props: IUpdateCategoryModalProps) {
  const { isOpen, categoryChose, handleModal, handleUpdateCategory } = props;

  const [categoriesMenu, setCategoriesMenu] = useState<Category[]>([]);
  // console.log("categoriesMenu: ", categoriesMenu);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UpdateCategory>({
    mode: "onChange",
    resolver: yupResolver(schemeUpdateCategory),
    defaultValues: {
      id: categoryChose.id,
      name: categoryChose.name,
      code: categoryChose.code,
      parent_id: categoryChose.parent_id,
    },
  });
  // console.log("Update this: ", categoryChose);
  // console.log("Update watch: ", watch());
  // useEffect(() => {
  //   reset({
  //     id: categoryChose.id,
  //     code: categoryChose.code,
  //     name: categoryChose.name,
  //   });
  // }, [categoryChose]);

  useEffect(() => {
    const fetchCategoriesAll = async () => {
      const categoryData: Category[] = await invoke("get_categories_all");
      const categoriesFilter = categoryData.filter(
        (category) => category.id !== categoryChose.id
      );
      // console.log(categoryData);
      setCategoriesMenu(categoriesFilter);
    };
    fetchCategoriesAll();
  }, []);

  const onSubmit = (data: UpdateCategory) => {
    console.log("UpdateCategory in: ", data);
    handleUpdateCategory(data);
    reset();

    handleModal(false);
  };
  console.log(watch());
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
          <p className="text-sm font-bold ">Cập nhật nhóm hàng</p>
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
                    htmlFor="code"
                    className=" block"
                    value="Mã nhóm hàng"
                  />
                </div>
                <TextInput
                  id="code"
                  type="text"
                  placeholder=""
                  className="flex-1"
                  color={errors.code ? "failure" : ""}
                  {...register("code")}
                />
              </div>
              {errors.code ? (
                <div className="text-red-500 text-sm mt-1">
                  <span>{errors.code.message}</span>
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
            <div className=" mb-4">
              <div className="flex items-center">
                <div className="mb-2 min-w-[115px]">
                  <Label
                    htmlFor="parent_id"
                    className=" block"
                    value="Nhóm mẹ"
                  />
                </div>
                <Select
                  id="parent_id"
                  color={errors.parent_id ? "failure" : ""}
                  className="w-full"
                  {...register("parent_id")}
                >
                  <option value="0"></option>
                  {categoriesMenu.map((category) => {
                    return (
                      <option
                        selected={categoryChose.parent_id === category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    );
                  })}
                </Select>
              </div>

              {errors.parent_id ? (
                <div className="text-red-500 text-sm mt-1">
                  <span>{errors.parent_id.message}</span>
                </div>
              ) : (
                <></>
              )}
            </div>
            {/* <div className="flex items-center mb-4">
              <div className="mb-2 min-w-[115px]">
                <Label htmlFor="parent_id" className=" block" value="Nhóm mẹ" />
              </div>
              <TextInput
                id="parent_id"
                type="text"
                placeholder="TG"
                className="flex-1"
                disabled
              />
            </div> */}
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
