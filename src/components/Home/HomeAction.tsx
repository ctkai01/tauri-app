import { invoke } from "@tauri-apps/api";
import {
  Button,
  Pagination,
  Spinner,
  TextInput,
  Tooltip,
} from "flowbite-react";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  CreateProduct,
  GetProductPaginate,
  ImageToServer,
  Product,
  UpdateCategoryToServer,
  UpdateProduct,
  UpdateProductToServer,
} from "../../models";
import { Category } from "../../pages/Home";
import { fileToArrayBuffer } from "../../utils";
import AddProductModal from "../Modal/Product/AddProductModal";
import DeleteProductModal from "../Modal/Product/DeleteProductModal ";
import InfoProductModal from "../Modal/Product/InfoProductModal";
import UpdateProductModal from "../Modal/Product/UpdateProductModal";
import TableContent from "./TableContent";
import { IoMdPrint } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import { Config, GetConfig } from "../../models/config";
export interface IHomeActionProps {
  categoryChose: Category;
}

export interface Paginate {
  limit: number;
  page: number;
  total_page: number;
  total_count: number;
}

export interface CheckboxProduct {
  product: Product;
  isCheck: boolean;
}
const LIMIT = 4;
export default function HomeAction(props: IHomeActionProps) {
  const { categoryChose } = props;
  const [products, setProducts] = React.useState<Product[]>([]);
  const [productChoose, setProductChoose] = React.useState<Product>();
  const [openAddProductModal, setOpenAddProductModal] = React.useState(false);
  const [openInfoProductModal, setOpenInfoProductModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [config, setConfig] = React.useState<Config>({
    id: 0,
    name: "",
    address: "",
  });
  const [checkboxes, setCheckboxes] = React.useState<CheckboxProduct[]>([]);
  const [paginate, setPaginate] = React.useState<Paginate>({
    limit: LIMIT,
    page: 1,
    total_count: 0,
    total_page: 0,
  });

  const [openDeleteProductModal, setOpenDeleteProductModal] =
    React.useState(false);
  const [openUpdateProductModal, setOpenUpdateProductModal] =
    React.useState(false);
  function handleActionAddProductModal(state: boolean) {
    setOpenAddProductModal(state);
  }

  function handleActionDeleteProductModal(state: boolean, product?: Product) {
    setProductChoose(product);
    setOpenDeleteProductModal(state);
  }

  function handleActionUpdateProductModal(state: boolean, product?: Product) {
    setProductChoose(product);
    setOpenUpdateProductModal(state);
  }

  function handleActionInfoProductModal(state: boolean, product?: Product) {
    setProductChoose(product);
    setOpenInfoProductModal(state);
  }

  const handleToggleCheckBox = (id: number) => {
    setCheckboxes((checkboxes) => {
      const checkboxesUpdate = [...checkboxes];

      const indexCheckBox = checkboxesUpdate.findIndex(
        (checkbox) => checkbox.product.id === id
      );

      if (indexCheckBox !== -1) {
        const checkboxUpdate = { ...checkboxesUpdate[indexCheckBox] };

        checkboxUpdate.isCheck = !checkboxUpdate.isCheck;
        checkboxesUpdate[indexCheckBox] = checkboxUpdate;

        return checkboxesUpdate;
      }
      return checkboxes;
    });
  };

  React.useEffect(() => {
    const fetchConfigs = async () => {
      setIsLoading(true);
      const getConfig: Config[] = await invoke("get_config");
      console.log("Config: ", getConfig);
      if (getConfig.length) {
        setConfig(getConfig[0]);
        setBusinessName(getConfig[0].name);
        setAddress(getConfig[0].address ? getConfig[0].address : "");
      } else {
        const configDefault: Config = {
          id: 0,
          name: "",
          address: "",
        };
        setConfig(configDefault);
        setBusinessName("");
      }
      setIsLoading(false);
    };
    fetchConfigs();
  }, []);

  console.log("business: ", businessName);
  console.log("address: ", address);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const getProductPaginate: GetProductPaginate = await invoke(
        "get_product_by_category",
        {
          data: JSON.stringify({
            category_id: categoryChose.id,
            page: paginate.page,
            limit: paginate.limit,
            search: search,
          }),
        }
      );
      console.log("getProductPaginate.products: ", getProductPaginate.products);
      setProducts(getProductPaginate.products);
      setPaginate((paginate) => {
        return {
          ...paginate,
          total_count: getProductPaginate.total_count,
          total_page: getProductPaginate.total_page,
        };
      });
      setIsLoading(false);

      // console.log("productsData: ", productsData);
    };
    fetchProducts();
  }, [paginate.page, categoryChose, search]);

  React.useEffect(() => {
    const data: CheckboxProduct[] = products.map((product) => {
      const checkExistBox = checkboxes.find(
        (item) => item.product.id === product.id
      );

      return {
        product: product,
        isCheck: checkExistBox ? checkExistBox.isCheck : false,
      };
    });
    setCheckboxes(data);
  }, [products]);

  const handleSaveBusiness = async () => {
    try {
      if (businessName) {
        if (config.id) {
          //Update
          await invoke("update_config", {
            data: JSON.stringify({
              name: businessName,
              id: config.id,
              address: address
            }),
          });
          setConfig({
            id: config.id,
            name: businessName,
          });
        } else {
          const createdConfig: number = await invoke("create_config", {
            data: JSON.stringify({
              name: businessName,
              address: address,
            }),
          });

          setConfig({
            id: createdConfig,
            name: businessName,
            address
          });
        }

        toast(
          <div className="font-bold">Cập nhật tên doanh nghiệp thành công</div>,
          {
            draggable: false,
            position: "top-right",
            type: "success",
          }
        );
      } else {
         toast(
           <div className="font-bold">
             Cập nhật tên doanh nghiệp thành công
           </div>,
           {
             draggable: false,
             position: "top-right",
             type: "success",
           }
         );
      }
    } catch (err) {
      toast(
        <div className="font-bold">Vui lòng nhập tên doanh nghiệp</div>,
        {
          draggable: false,
          position: "top-right",
          type: "warning",
        }
      );
    }
  };

  const handleAddProduct = async (
    createProduct: CreateProduct,
    // imageFile: File | undefined,
    totalWeight: string
  ) => {
    try {
      // Add to DB
      // let image = null;
      // if (imageFile) {
      //   const fileData: any = await fileToArrayBuffer(imageFile);
      //   const fileName = imageFile.name;

      //   image = {
      //     image_data: Array.from(new Uint8Array(fileData)), // Convert ArrayBuffer to array of bytes
      //     file_name: fileName,
      //   };
      // }

      let totalWeightNum = parseFloat(totalWeight);

      const createdProduct: Product = await invoke("create_product", {
        data: JSON.stringify({
          // image,
          name: createProduct.name,
          // unit: createProduct.unit,
          gold_weight: createProduct.goldWeight,
          gold_percent: createProduct.goldPercent,
          stone_weight: createProduct.stoneWeight,
          wage: createProduct.wage,
          company: createProduct.company,
          company_address: createProduct.companyAddress,
          total_weight: totalWeightNum,
          quantity: +createProduct.quantity,
          category_id: createProduct.categoryID,
        }),
      });
      if (products.length >= LIMIT) {
        setProducts((products) => {
          const updatedProducts = products.slice(0, -1);

          updatedProducts.unshift(createdProduct);
          return updatedProducts;
        });
        setPaginate((paginate) => {
          return {
            ...paginate,
            total_page: paginate.total_page + 1,
          };
        });
      } else {
        setProducts((products) => [createdProduct, ...products]);
      }
      // Update
      handleActionAddProductModal(false);
      toast(
        <div className="font-bold">Thêm mới nhóm hàng hóa thành công</div>,
        {
          draggable: false,
          position: "top-right",
          type: "success",
        }
      );
    } catch (err) {
      handleActionAddProductModal(false);

      toast(<div className="font-bold">Thêm mới nhóm hàng hóa thất bại</div>, {
        draggable: false,
        position: "top-right",
        type: "error",
      });
    }
  };
  console.log("productChoose: ", productChoose);

  const handleDeleteProduct = async () => {
    try {
      if (productChoose) {
        await invoke("delete_product", {
          data: JSON.stringify({
            id: productChoose.id,
          }),
        });

        if (products.length === 1) {
          if (paginate.page > 1) {
            setPaginate((paginate) => {
              return {
                ...paginate,
                page: paginate.page - 1,
              };
            });
          }
        }
        setProducts((products) => {
          const productsUpdate = [...products];

          return productsUpdate.filter(
            (product) => product.id !== productChoose.id
          );
        });
        handleActionDeleteProductModal(false);
        toast(<div className="font-bold">Xóa nhóm hàng hóa thành công</div>, {
          draggable: false,
          position: "top-right",
          type: "success",
        });
      }
    } catch (err) {
      handleActionDeleteProductModal(false);
      console.log(err);
      toast(<div className="font-bold">Xóa nhóm hàng hóa thất bại</div>, {
        draggable: false,
        position: "top-right",
        type: "error",
      });
    }
  };

  const handleUpdateProduct = async (
    updateProduct: UpdateProduct,
    // imageFile: File | undefined,
    totalWeight: string
  ) => {
    try {
      if (productChoose) {
        // let image: ImageToServer | null = null;
        // if (imageFile) {
        //   const fileData: any = await fileToArrayBuffer(imageFile);
        //   const fileName = imageFile.name;

        //   image = {
        //     image_data: Array.from(new Uint8Array(fileData)), // Convert ArrayBuffer to array of bytes
        //     file_name: fileName,
        //   };
        // }

        let totalWeightNum = parseFloat(totalWeight);
        const dataUpdate: UpdateProductToServer = {
          id: productChoose.id,
          name: updateProduct.name,
          // unit: updateProduct.unit,
          gold_weight: updateProduct.goldWeight,
          gold_percent: updateProduct.goldPercent,
          stone_weight: updateProduct.stoneWeight,
          // note: updateProduct.note,
          company: updateProduct.company,
          company_address: updateProduct.companyAddress,
          wage: updateProduct.wage,
          total_weight: totalWeightNum,
          // stone_price: updateProduct.stonePrice,
          // price: updateProduct.price,
          quantity: +updateProduct.quantity,
          category_id: updateProduct.categoryID,
          // image,
        };
        const productDataUpdate: Product = await invoke("update_product", {
          data: JSON.stringify(dataUpdate),
        });
        setProducts((products) => {
          const productsUpdate = [...products];
          const indexProductUpdate = products.findIndex(
            (product) => product.id === productChoose.id
          );

          if (indexProductUpdate !== -1) {
            const productUpdate = { ...productsUpdate[indexProductUpdate] };

            productsUpdate[indexProductUpdate] = {
              ...productUpdate,
              ...productDataUpdate,
            };
          }

          return productsUpdate;
        });
        console.log("productUpdate: ", productDataUpdate);
        handleActionUpdateProductModal(false);

        toast(
          <div className="font-bold">Cập nhật nhóm hàng hóa thành công</div>,
          {
            draggable: false,
            position: "top-right",
            type: "success",
          }
        );
      }
    } catch (err) {
      handleActionUpdateProductModal(false);
      console.log(err);
      toast(<div className="font-bold">Cập nhật nhóm hàng hóa thất bại</div>, {
        draggable: false,
        position: "top-right",
        type: "error",
      });
    }
  };

  const onPageChange = (page: number) =>
    setPaginate((paginate) => {
      return {
        ...paginate,
        page,
      };
    });

  const handlePrint = async () => {
    const productPrint = checkboxes
      .filter((checkbox) => checkbox.isCheck)
      .map((checkbox) => checkbox.product);

    if (!productPrint.length) {
      toast(<div className="font-bold">Vui lòng chọn hàng hóa để in</div>, {
        draggable: false,
        position: "top-right",
        type: "warning",
      });
    } else {
      await invoke("print_excel", {
        data: JSON.stringify({
          products: productPrint,
          business: businessName,
          address
        }),
      });
      console.log("Print: ", productPrint);
    }
  };

  console.log("Checkbox:L ", checkboxes);
  return (
    <div className="flex flex-col h-full">
      {openAddProductModal && (
        <AddProductModal
          isOpen={openAddProductModal}
          categoryChose={categoryChose}
          handleAddProduct={handleAddProduct}
          handleModal={handleActionAddProductModal}
        />
      )}
      {openInfoProductModal && productChoose && (
        <InfoProductModal
          isOpen={openInfoProductModal}
          productChoose={productChoose}
          // categoryChose={categoryChose}
          // handleAddProduct={handleAddProduct}
          handleModal={handleActionInfoProductModal}
        />
      )}
      {openUpdateProductModal && productChoose && (
        <UpdateProductModal
          productChoose={productChoose}
          categoryChose={categoryChose}
          isOpen={openUpdateProductModal}
          handleUpdateProduct={handleUpdateProduct}
          // categoryChose={categoryChose}
          // handleAddProduct={handleAddProduct}
          handleModal={handleActionUpdateProductModal}
        />
      )}
      {openDeleteProductModal && productChoose && (
        <DeleteProductModal
          isOpen={openDeleteProductModal}
          // categoryChose={categoryChose}
          // handleAddProduct={handleAddProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleModal={handleActionDeleteProductModal}
        />
      )}

      <div className="p-2 text-xs h-16">
        {/* <p>Hàng hóa</p> */}
        <div className="flex">
          <TextInput
            className="mr-2"
            type="text"
            placeholder="Tìm kiếm"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <TextInput
            className="mr-2"
            type="text"
            value={businessName}
            placeholder="Tên doanh nghiệp"
            onChange={(e) => {
              setBusinessName(e.target.value);
            }}
          />
          <TextInput
            className="mr-2"
            type="text"
            value={address}
            placeholder="Địa chỉ doanh nghiệp"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          <Tooltip content="Lưu thông tin">
            <Button
              className="mr-2"
              color="blue"
              onClick={() => {
                handleSaveBusiness();
              }}
            >
              <IoIosSave />
            </Button>
          </Tooltip>
          <div className="flex-1 flex justify-end">
            <Tooltip content="In">
              <Button
                className="mr-2"
                color="dark"
                onClick={() => handlePrint()}
              >
                <IoMdPrint />
              </Button>
            </Tooltip>

            <Tooltip content="Thêm hàng hóa">
              <Button
                color="success"
                onClick={() => handleActionAddProductModal(true)}
              >
                <FaPlus />
              </Button>
            </Tooltip>
          </div>
        </div>
        {/* <p>
          Nhóm hàng đang được chọn:{" "}
        </p> */}
      </div>
      <div className="p-3 border-[4px] bg-white flex flex-col  flex-grow">
        {isLoading && (
          <div className="flex-1 flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        )}
        {!isLoading && (
          <>
            <TableContent
              products={products}
              checkboxes={checkboxes}
              handleToggleCheckBox={handleToggleCheckBox}
              handleActionInfoProductModal={handleActionInfoProductModal}
              handleActionUpdateProductModal={handleActionUpdateProductModal}
              handleActionDeleteProductModal={handleActionDeleteProductModal}
            />
            {products.length === 0 && (
              <div className="flex-1 flex justify-center items-center text-center text-sm">
                Hàng hóa trống
              </div>
            )}
            {products.length !== 0 && paginate.total_page > 1 && (
              <div className="flex overflow-x-auto sm:justify-center">
                <Pagination
                  currentPage={paginate.page}
                  totalPages={paginate.total_page}
                  onPageChange={onPageChange}
                  translate="yes"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
