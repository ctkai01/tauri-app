import { invoke } from "@tauri-apps/api";
import { Button, Tooltip } from "flowbite-react";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { CreateProduct, Product } from "../../models";
import { Category } from "../../pages/Home";
import { fileToArrayBuffer } from "../../utils";
import AddProductModal from "../Modal/Product/AddProductModal";
import DeleteProductModal from "../Modal/Product/DeleteProductModal ";
import InfoProductModal from "../Modal/Product/InfoProductModal";
import UpdateProductModal from "../Modal/Product/UpdateProductModal";
import TableContent from "./TableContent";

export interface IHomeActionProps {
  categoryChose: Category | null;
}

export default function HomeAction(props: IHomeActionProps) {
  const { categoryChose } = props;
  const [products, setProducts] = React.useState<Product[]>([]);
  const [productChoose, setProductChoose] = React.useState<Product>();
  const [openAddProductModal, setOpenAddProductModal] = React.useState(false);
  const [openInfoProductModal, setOpenInfoProductModal] = React.useState(false);
  const [openDeleteProductModal, setOpenDeleteProductModal] = React.useState(false);
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

  React.useEffect(() => {
    const fetchProducts = async () => {
      const productsData: Product[] = await invoke("get_product_by_category", {
        data: JSON.stringify({
          category_id: 1,
          page: 1,
          limit: 1,
        }),
      });
      setProducts(productsData);
      console.log("productsData: ", productsData);
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (
    createProduct: CreateProduct,
    imageFile: File | undefined,
    totalWeight: string
  ) => {
    // Add to DB
    let image = null;
    if (imageFile) {
      const fileData: any = await fileToArrayBuffer(imageFile);
      const fileName = imageFile.name;

      image = {
        image_data: Array.from(new Uint8Array(fileData)), // Convert ArrayBuffer to array of bytes
        file_name: fileName,
      };
    }

    let totalWeightNum = parseFloat(totalWeight);

    const idProduct = invoke("create_product", {
      data: JSON.stringify({
        image,
        name: createProduct.name,
        unit: createProduct.unit,
        gold_weight: createProduct.goldWeight,
        gold_age: createProduct.goldAge,
        stone_weight: createProduct.stoneWeight,
        note: createProduct.note,
        wage: createProduct.wage,
        total_weight: totalWeightNum,
        stone_price: createProduct.stonePrice,
        price: createProduct.price,
        quantity: +createProduct.quantity,
        category_id: createProduct.categoryID,
      }),
    });

    // Update
    handleActionAddProductModal(false)
     toast(<div className="font-bold">Thêm mới nhóm hàng hóa thành công</div>, {
       draggable: false,
       position: "top-right",
       type: "success",
     });
  };
  console.log("productChoose: ", productChoose);

  const handleDeleteProduct  = () => {
    console.log("delte")
  } 
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
          isOpen={openUpdateProductModal}
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
        <TableContent
          products={products}
          handleActionInfoProductModal={handleActionInfoProductModal}
          handleActionUpdateProductModal={handleActionUpdateProductModal}
          handleActionDeleteProductModal={handleActionDeleteProductModal}
        />
      </div>
    </div>
  );
}
