import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CustomFlowbiteTheme,
  FileInput,
  Flowbite,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { NumericFormat } from "react-number-format";
import { ValidationError } from "yup";
import {
  CreateProduct,
  Product,
  UpdateAvatar,
  UpdateProduct,
} from "../../../models";
import { Category } from "../../../pages/Home";
import {
  schemeCreateProduct,
  schemeUpdateImage,
  schemeUpdateProduct,
} from "../../../validators";
import { invoke } from "@tauri-apps/api";
import { fileToArrayBuffer } from "../../../utils";
import { convertFileSrc } from "@tauri-apps/api/tauri";
export interface IUpdateProductModalProps {
  isOpen: boolean;
  handleModal: (state: boolean) => void;
  productChoose: Product;
  categoryChose: Category
  handleUpdateProduct: (
    data: UpdateProduct,
    // imageFile: File | undefined,
    totalWeight: string
  ) => void;
  // handleAddProduct: (
  //   createProduct: CreateProduct,
  //   imageFile: File | undefined,
  //   totalWeight: string
  // ) => void;
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

export default function UpdateProductModal(props: IUpdateProductModalProps) {
  const { isOpen, handleModal, categoryChose, productChoose, handleUpdateProduct } = props;
  // const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  // const [imagePreview, setImagePreview] = useState(
  //   productChoose.image ? convertFileSrc(productChoose.image) : "/empty.jpg"
  // );
  const [totalWeight, setTotalWeight] = useState("");
  // const inputImageRef = useRef<HTMLInputElement>(null);
  // const [errorImage, setErrorImage] = useState("");
  const [categoriesMenu, setCategoriesMenu] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<UpdateProduct>({
    mode: "onChange",
    resolver: yupResolver(schemeUpdateProduct),
    defaultValues: {
      categoryID: productChoose.category_id,
      goldPercent: productChoose.gold_percent,
      goldWeight: productChoose.gold_weight,
      name: productChoose.name,
      // note: productChoose.note,
      // price: productChoose.price,
      quantity: `${productChoose.quantity}`,
      // stonePrice: productChoose.stone_price,
      stoneWeight: productChoose.stone_weight,
      // unit: productChoose.unit,
      wage: productChoose.wage,
    },
    // values: {
    //   price: 1.1,
    //   name: "tét",
    //   unit: "h"
    // }
  });
  const goldWeight = watch("goldWeight") || "";
  const stoneWeight = watch("stoneWeight") || "";

  useEffect(() => {
    const fetchCategoriesAll = async () => {
      const categoriesData: Category[] = await invoke("get_categories_all");

      setCategoriesMenu(categoriesData);
    };
    fetchCategoriesAll();
  }, []);
  useEffect(() => {
    const goldWeightNum = parseFloat(goldWeight);
    const stoneWeightNum = parseFloat(stoneWeight);

    if (!isNaN(goldWeightNum) && !isNaN(stoneWeightNum)) {
      const newTotalWeight = (goldWeightNum || 0) + (stoneWeightNum || 0);
      setTotalWeight(newTotalWeight.toFixed(2));
    } else {
      setTotalWeight("");
    }
  }, [goldWeight, stoneWeight]);

  const onSubmit = async (data: UpdateProduct) => {
    handleUpdateProduct(data, totalWeight);
    // handleAddProduct(data, imageFile, totalWeight);
    // handleAddCategory(data);
    // reset();
    // toast(<div className="font-bold">Thêm mới nhóm hàng thành công</div>, {
    //   draggable: false,
    //   position: "top-right",
    //   type: "success",
    // });

    // handleModal(false);
  };
  // const handleInputChange = (e: any) => {
  //   const input = e.target;
  //   const value = input.value.replace(/\D/g, ""); // Remove non-digit characters
  //   input.value = new Intl.NumberFormat().format(value); // Format the number with commas
  // };
  // const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
  //   try {
  //     const data: UpdateAvatar = {
  //       image: e.target.files ? e.target.files[0] : undefined,
  //     };
  //     const dataValidate = await schemeUpdateImage.validate(data);
  //     const newFile = dataValidate.image;
  //     setErrorImage("");
  //     setImageFile(newFile);

  //     if (newFile) {
  //       setImagePreview(URL.createObjectURL(newFile));
  //     }
  //   } catch (e) {
  //     if (e instanceof ValidationError) {
  //       // setValue("image", undefined);
  //       setErrorImage(e.message);
  //     }
  //   }
  // };

  // const handleRemoveImage = () => {
  //   setImagePreview("");
  //   setImageFile(undefined);
  //   setErrorImage("");

  //   if (inputImageRef && inputImageRef.current) {
  //     inputImageRef.current.value = "";
  //   }
  // };
  return (
    <Flowbite theme={{ theme: customThemeModal }}>
      <Modal
        // dismissible
        show={isOpen}
        size="xl"
        onClose={() => handleModal(false)}
        popup
      >
        <Modal.Header>
          <p className="text-sm font-bold ">Cập nhật hàng hóa</p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-4">
            <div className="max-h-[400px] overflow-y-scroll pr-4">
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

              {/* <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label htmlFor="unit" className=" block" value="Đơn vị" />
                  </div>

                  <TextInput
                    id="unit"
                    type="text"
                    placeholder=""
                    className="flex-1"
                    color={errors.name ? "failure" : ""}
                    {...register("unit")}
                  />
                </div>

                {errors.unit ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.unit.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div> */}
              <div className="mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="category_id"
                      className=" block"
                      value="Nhóm hàng"
                    />
                  </div>
                  <Select
                    id="category_id"
                    required
                    {...register("categoryID")}
                    color={errors.name ? "failure" : ""}
                    className="w-full"
                  >
                    <option selected value={categoryChose.id}>{categoryChose.name}</option>
                    {/* {categoriesMenu.map((category) => {
                      return (
                        <option
                          value={category.id}
                          selected={category.id == productChoose.category_id}
                        >
                          {category.name}
                        </option>
                      );
                    })} */}
                  </Select>
                </div>

                {errors.categoryID ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.categoryID.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {/* <div className="mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label htmlFor="image" className=" block" value="Ảnh" />
                  </div>
                  <div className="">
                    <FileInput
                      id="image"
                      ref={inputImageRef}
                      helperText={errorImage ? errorImage : ""}
                      color={errorImage ? "failure" : ""}
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <div>
                        <div className="flex justify-center border mt-2 relative">
                          <img
                            // src="https://www.flowbite-react.com/images/people/profile-picture-5.jpg"
                            src={imagePreview}
                            className="max-w-[150px]  h-[100px]"
                          />

                          <div
                            className="absolute right-0 top-0 cursor-pointer"
                            onClick={() => handleRemoveImage()}
                          >
                            <IoMdClose />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div> */}
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="gold_weight"
                      className=" block"
                      value="TL vàng"
                    />
                  </div>

                  <TextInput
                    id="gold_weight"
                    type="number"
                    step="any"
                    placeholder=""
                    className="flex-1"
                    color={errors.goldWeight ? "failure" : ""}
                    {...register("goldWeight")}
                  />
                </div>

                {errors.goldWeight ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.goldWeight.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="goldPercent"
                      className=" block"
                      value="Hàm lượng vàng"
                    />
                  </div>

                  <TextInput
                    id="goldPercent"
                    type="text"
                    // step="any"
                    placeholder=""
                    className="flex-1"
                    color={errors.goldPercent ? "failure" : ""}
                    {...register("goldPercent")}
                  />
                </div>

                {errors.goldPercent ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.goldPercent.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="stoneWeight"
                      className=" block"
                      value="KL đá"
                    />
                  </div>

                  <TextInput
                    id="stoneWeight"
                    type="number"
                    step="any"
                    placeholder=""
                    className="flex-1"
                    color={errors.stoneWeight ? "failure" : ""}
                    {...register("stoneWeight")}
                  />
                </div>

                {errors.stoneWeight ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.stoneWeight.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="totalWeight"
                      className=" block"
                      value="Tổng TL"
                    />
                  </div>

                  <TextInput
                    id="totalWeight"
                    type="number"
                    step="any"
                    placeholder=""
                    className="flex-1"
                    readOnly={true}
                    value={totalWeight}
                    color={""}
                    // color={errors.stoneWeight ? "failure" : ""}
                  />
                </div>
              </div>
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="wage"
                      className=" block"
                      value="Tiền công"
                    />
                  </div>
                  <Controller
                    name="wage"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        customInput={TextInput}
                        // customInput={(props: {}) => (
                        //   <TextInput {...props} className="w-full" color={""} />
                        // )}
                        thousandSeparator={true}
                        allowNegative={false}
                        prefix={""}
                        onValueChange={(v) => {
                          field.onChange(v.value);
                        }}
                        className="w-full"
                        value={field.value}
                      />
                    )}
                  />
                </div>

                {errors.wage ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.wage.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {/* <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="stonePrice"
                      className=" block"
                      value="Tiền đá"
                    />
                  </div>
                  <Controller
                    name="stonePrice"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        customInput={TextInput}
                        // customInput={(props: {}) => (
                        //   <TextInput {...props} className="w-full" color={""} />
                        // )}
                        thousandSeparator={true}
                        allowNegative={false}
                        prefix={""}
                        onValueChange={(v) => {
                          field.onChange(v.value);
                        }}
                        className="w-full"
                        value={field.value}
                      />
                    )}
                  />
                </div>

                {errors.stonePrice ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.stonePrice.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div> */}
              {/* <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="price"
                      className=" block"
                      value="Tiền hàng"
                    />
                  </div>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        customInput={TextInput}
                        thousandSeparator={true}
                        allowNegative={false}
                        prefix={""}
                        onValueChange={(v) => {
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
              </div> */}
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="quantity"
                      className=" block"
                      value="Số lượng"
                    />
                  </div>

                  <TextInput
                    id="quantity"
                    type="number"
                    step="any"
                    placeholder=""
                    className="flex-1"
                    color={errors.quantity ? "failure" : ""}
                    {...register("quantity")}
                  />
                </div>

                {errors.quantity ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.quantity.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {/* <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label htmlFor="note" className=" block" value="Ghi chú" />
                  </div>
                  <Textarea
                    id="note"
                    placeholder=""
                    rows={4}
                    color={errors.note ? "failure" : ""}
                    {...register("note")}
                  />
                </div>

                {errors.note ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.note.message}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div> */}
            </div>
            <div className="flex text-xs justify-center gap-4 mt-3">
              <Button size="sm" color="success" type="submit">
                Cập nhật
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
