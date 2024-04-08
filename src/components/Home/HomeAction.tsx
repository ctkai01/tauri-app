import { invoke } from "@tauri-apps/api";
import { Button, Tooltip } from "flowbite-react";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { CreateProduct, Product } from "../../models";
import { Category } from "../../pages/Home";
import { fileToArrayBuffer } from "../../utils";
import AddProductModal from "../Modal/Product/AddProductModal";
import TableContent from "./TableContent";

export interface IHomeActionProps {
  categoryChose: Category | null;
}

export default function HomeAction(props: IHomeActionProps) {
  const { categoryChose } = props;
  const [products, setProducts] = React.useState<Product[]>([]);
  const [openAddProductModal, setOpenAddProductModal] = React.useState(false);
  function handleActionAddProductModal(state: boolean) {
    setOpenAddProductModal(state);
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
  };

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
        <TableContent products={products}/>
      </div>
    </div>
  );
}
