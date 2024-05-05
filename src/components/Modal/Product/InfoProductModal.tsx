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
import { CreateProduct, Product, UpdateAvatar } from "../../../models";
import { Category } from "../../../pages/Home";
import { schemeCreateProduct, schemeUpdateImage } from "../../../validators";
import { invoke } from "@tauri-apps/api";
import { fileToArrayBuffer } from "../../../utils";
import { convertFileSrc } from "@tauri-apps/api/tauri";
// import emptyImg from "../../assets/images/empty.jpg";

export interface IInfoProductModalProps {
  isOpen: boolean;
  // categoryChose: Category | null;
  productChoose: Product
  handleModal: (state: boolean) => void;
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

export default function InfoProductModal(props: IInfoProductModalProps) {
  const { isOpen, productChoose, handleModal } = props;
  // const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  // const [imagePreview, setImagePreview] = useState("");
  // const [totalWeight, setTotalWeight] = useState("");
  // const inputImageRef = useRef<HTMLInputElement>(null);
  const [categoriesMenu, setCategoriesMenu] = useState<Category[]>([]);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  //   reset,
  //   watch,
  // } = useForm<CreateProduct>({
  //   mode: "onChange",
  //   resolver: yupResolver(schemeCreateProduct),
  //   // values: {
  //   //   price: 1.1,
  //   //   name: "tét",
  //   //   unit: "h"
  //   // }
  // });
  // const goldWeight = watch("goldWeight") || "";
  // const stoneWeight = watch("stoneWeight") || "";

  useEffect(() => {
    const fetchCategoriesAll = async () => {
      const categoriesData: Category[] = await invoke("get_categories_all");

      setCategoriesMenu(categoriesData);
    };
    fetchCategoriesAll();
  }, []);
  // useEffect(() => {
  //   const goldWeightNum = parseFloat(goldWeight);
  //   const stoneWeightNum = parseFloat(stoneWeight);

  //   if (!isNaN(goldWeightNum) && !isNaN(stoneWeightNum)) {
  //     const newTotalWeight = (goldWeightNum || 0) + (stoneWeightNum || 0);
  //     setTotalWeight(newTotalWeight.toFixed(2));
  //   } else {
  //     setTotalWeight("");
  //   }
  // }, [goldWeight, stoneWeight]);

  // const onSubmit = async (data: CreateProduct) => {
  //   handleAddProduct(data, imageFile, totalWeight);
  // handleAddCategory(data);
  // reset();
  // toast(<div className="font-bold">Thêm mới nhóm hàng thành công</div>, {
  //   draggable: false,
  //   position: "top-right",
  //   type: "success",
  // });

  // handleModal(false);
  // };
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
  console.log("fd: ", productChoose);
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
          <p className="text-sm font-bold ">Thông tin hàng hóa</p>
        </Modal.Header>
        <Modal.Body>
          <form className="flex-col gap-4">
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
                    value={productChoose.name}
                    readOnly={true}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="company"
                      className=" block"
                      value="Nhà cung cấp"
                    />
                  </div>

                  <TextInput
                    id="company"
                    type="text"
                    placeholder=""
                    value={productChoose.company}
                    readOnly={true}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label
                      htmlFor="company_address"
                      className=" block"
                      value="Địa chỉ NCC"
                    />
                  </div>

                  <TextInput
                    id="company_address"
                    type="text"
                    placeholder=""
                    value={productChoose.company_address}
                    readOnly={true}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* <div className=" mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label htmlFor="unit" className=" block" value="Đơn vị" />
                  </div>

                  <TextInput
                    id="unit"
                    type="text"
                    value={productChoose.unit}
                    readOnly={true}
                    className="flex-1"
                  />
                </div>
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
                  <Select id="category_id" required className="w-full">
                    {categoriesMenu.map((category) => {
                      return (
                        <option
                          value={category.id}
                          selected={productChoose.category_id === category.id}
                        >
                          {category.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              {/* <div className="mb-4">
                <div className="flex items-center">
                  <div className="mb-2 min-w-[115px]">
                    <Label htmlFor="image" className=" block" value="Ảnh" />
                  </div>
                  <div className=""> */}
              {/* <FileInput
                      id="image"
                      ref={inputImageRef}
                      helperText={errorImage ? errorImage : ""}
                      color={errorImage ? "failure" : ""}
                      onChange={handleFileChange}
                    /> */}
              {/* {imagePreview && (
                      <div>
                        <div className="flex justify-center border mt-2 relative">
                          <img
                            // src="https://www.flowbite-react.com/images/people/profile-picture-5.jpg"
                            src={imagePreview}
                            className="max-w-[150px]"
                          />
                          <div
                            className="absolute right-0 top-0 cursor-pointer"
                            onClick={() => handleRemoveImage()}
                          >
                            <IoMdClose />
                          </div>
                        </div>
                      </div>
                    )} */}
              {/* <img
                      // src="https://www.flowbite-react.com/images/people/profile-picture-5.jpg"
                      // src={imagePreview}
                      src={convertFileSrc(productChoose.image)}
                      className="max-w-[150px]"
                    /> */}

              {/* {productChoose.image && (
                      <img
                        className=" h-[80px]"
                        // src={convertFileSrc("/home/ctkai/Downloads/ip12.jpeg")}
                        src={convertFileSrc(productChoose.image)}
                      />
                    )}

                    {!productChoose.image && (
                      <img className=" h-[80px]" src="/empty.jpg" />
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
                    value={productChoose.gold_weight}
                    readOnly={true}
                    className="flex-1"
                    // color={errors.goldWeight ? "failure" : ""}
                    // {...register("goldWeight")}
                  />
                </div>

                {/* {errors.goldWeight ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.goldWeight.message}</span>
                  </div>
                ) : (
                  <></>
                )} */}
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
                    value={productChoose.gold_percent}
                    readOnly={true}
                    className="flex-1"
                    // color={errors.goldAge ? "failure" : ""}
                    // {...register("goldAge")}
                  />
                </div>

                {/* {errors.goldAge ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.goldAge.message}</span>
                  </div>
                ) : (
                  <></>
                )} */}
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
                    value={productChoose.stone_weight}
                    readOnly={true}
                    className="flex-1"
                    // color={errors.stoneWeight ? "failure" : ""}
                    // {...register("stoneWeight")}
                  />
                </div>

                {/* {errors.stoneWeight ? (
                  <div className="text-red-500 text-sm mt-1">
                    <span>{errors.stoneWeight.message}</span>
                  </div>
                ) : (
                  <></>
                )} */}
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
                    value={productChoose.total_weight}
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
                  {/* <Controller
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
                  /> */}
                  <NumericFormat
                    customInput={TextInput}
                    // customInput={(props: {}) => (
                    //   <TextInput {...props} className="w-full" color={""} />
                    // )}
                    readOnly={true}
                    value={productChoose.wage}
                    thousandSeparator={true}
                    allowNegative={false}
                    prefix={""}
                    className="w-full"
                  />
                </div>
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
                  <NumericFormat
                    customInput={TextInput}
                    // customInput={(props: {}) => (
                    //   <TextInput {...props} className="w-full" color={""} />
                    // )}
                    thousandSeparator={true}
                    allowNegative={false}
                    prefix={""}
                    // onValueChange={(v) => {
                    //   field.onChange(v.value);
                    // }}
                    className="w-full"
                    readOnly={true}
                    value={productChoose.stone_price}
                  />
                </div>
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
                  <NumericFormat
                    customInput={TextInput}
                    // customInput={(props: {}) => (
                    //   <TextInput {...props} className="w-full" color={""} />
                    // )}
                    thousandSeparator={true}
                    allowNegative={false}
                    prefix={""}
                    // onValueChange={(v) => {
                    //   field.onChange(v.value);
                    // }}
                    className="w-full"
                    readOnly={true}
                    value={productChoose.price}
                  />
                </div>
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

                  <NumericFormat
                    customInput={TextInput}
                    // customInput={(props: {}) => (
                    //   <TextInput {...props} className="w-full" color={""} />
                    // )}
                    thousandSeparator={true}
                    allowNegative={false}
                    prefix={""}
                    // onValueChange={(v) => {
                    //   field.onChange(v.value);
                    // }}
                    className="w-full"
                    readOnly={true}
                    value={productChoose.quantity}
                  />
                </div>
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
                    readOnly={true}
                    value={productChoose.note}
                  />
                </div>
              </div> */}
            </div>
            <div className="flex text-xs justify-center gap-4 mt-3">
              <Button size="sm" color="gray" onClick={() => handleModal(false)}>
                Quay lại
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
}
