import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CustomFlowbiteTheme,
  Flowbite,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import { CreateCategory, CreateProduct } from "../../../models";
import { schemeCreateCategory, schemeCreateProduct } from "../../../validators";
import { toast } from "react-toastify";
import { Category } from "../../../pages/Home";
import { NumericFormat } from "react-number-format";

export interface IAddProductModalProps {
  isOpen: boolean;
  categoryChose: Category | null;
  handleModal: (state: boolean) => void;
  // handleAddCategory: (data: CreateCategory) => void;
}

const customThemeModal: CustomFlowbiteTheme = {
  modal: {
    body: {
      base: "p-6 flex-1",
      popup: "pt-0",
    },
  },
};

export default function AddProductModal(props: IAddProductModalProps) {
  const { isOpen, categoryChose, handleModal } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateProduct>({
    mode: "onChange",
    resolver: yupResolver(schemeCreateProduct),
    // values: {
    //   price: 1.1,
    //   name: "tét",
    //   unit: "h"
    // }
  });
  const onSubmit = (data: CreateProduct) => {
    console.log(data);
    // handleAddCategory(data);
    // reset();
    // toast(<div className="font-bold">Thêm mới nhóm hàng thành công</div>, {
    //   draggable: false,
    //   position: "top-right",
    //   type: "success",
    // });

    handleModal(false);
  };
  // const handleInputChange = (e: any) => {
  //   const input = e.target;
  //   const value = input.value.replace(/\D/g, ""); // Remove non-digit characters
  //   input.value = new Intl.NumberFormat().format(value); // Format the number with commas
  // };
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
          <p className="text-sm font-bold ">Thêm mới hàng hóa</p>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" max-w-md flex-col gap-4"
          >
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
                    htmlFor="name_category"
                    className=" block"
                    value="Giá"
                  />
                </div>
                {/* <TextInput
                  id="name_category"
                  type="text"
                  placeholder=""
                  className="flex-1"
                  color={errors.price ? "failure" : ""}
                  {...register("price")}
                  onChange={handleInputChange}
                /> */}
                <Controller
                  name="price"
                  control={control}
                  render={({ field, }) => (
                    <NumericFormat
                      customInput={TextInput}
                      thousandSeparator={true}
                      allowNegative={false}
                      prefix={"$ "}
                      onValueChange={(v) => {
                        //value without dollar sign
                        console.log("dsds")
                        field.onChange(v.value);
                      }}
                      className="w-full"
                      value={field.value}
                    />
                  )}
                />
              </div>

              {errors.price ? (
                <div className="text-red-500 text-sm mt-1">
                  <span>{errors.price.message}</span>
                </div>
              ) : (
                <></>
              )}
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
