import { Button, Checkbox, Table, Tooltip } from "flowbite-react";
import * as React from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Product } from "../../models";
import { calculateTotalPrice } from "../../utils";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { appDataDir } from "@tauri-apps/api/path";

export interface ITableContentProps {
  products: Product[];
  handleActionInfoProductModal: (state: boolean, product?: Product) => void;
  handleActionUpdateProductModal: (state: boolean, product?: Product) => void;
  handleActionDeleteProductModal: (state: boolean, product?: Product) => void;
}

export default function TableContent(props: ITableContentProps) {
  const {
    products,
    handleActionInfoProductModal,
    handleActionUpdateProductModal,
    handleActionDeleteProductModal,
  } = props;
  const test = async() => {
    const appDataDirPath = await appDataDir();
    console.log("appDataDirPath: ", appDataDirPath);
  }
  test()
  return (
    <div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Tên hàng</Table.HeadCell>
          <Table.HeadCell>Hình ảnh</Table.HeadCell>
          <Table.HeadCell>Số lượng</Table.HeadCell>
          <Table.HeadCell>Giá</Table.HeadCell>
          <Table.HeadCell>
            {/* <span className="sr-only">Edit</span> */}
            Hành động
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {products.map((product, i) => {
            return (
              <Table.Row
                key={i}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {product.name}
                </Table.Cell>
                <Table.Cell>
                  {product.image && (
                    <img
                      className=" h-[80px]"
                      // src={convertFileSrc("/home/ctkai/Downloads/ip12.jpeg")}
                      src={convertFileSrc(product.image)}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{product.quantity}</Table.Cell>
                <Table.Cell>
                  {calculateTotalPrice([
                    product.price ?? "0",
                    product.stone_price ?? "0",
                    product.wage ?? "0",
                  ])}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex  gap-1">
                    <Tooltip content="Chi tiết hàng hóa">
                      <Button
                        onClick={() =>
                          handleActionInfoProductModal(true, product)
                        }
                        color="blue"
                      >
                        <FaCircleInfo />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Cập nhật hàng hóa">
                      <Button
                        onClick={() =>
                          handleActionUpdateProductModal(true, product)
                        }
                      >
                        <BsFillPencilFill />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Xóa hàng hóa">
                      <Button 
                        onClick={() =>
                          handleActionDeleteProductModal(true, product)
                        }
                      
                      color="failure">
                        <MdDelete />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}

          {/* <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Microsoft Surface Pro
            </Table.Cell>
            <Table.Cell>White</Table.Cell>
            <Table.Cell>Laptop PC</Table.Cell>
            <Table.Cell>$1999</Table.Cell>
            <Table.Cell>
              <div className="flex  gap-1">
                <Tooltip content="Chi tiết hàng hóa">
                  <Button color="blue">
                    <FaCircleInfo />
                  </Button>
                </Tooltip>
                <Tooltip content="Cập nhật hàng hóa">
                  <Button>
                    <BsFillPencilFill />
                  </Button>
                </Tooltip>
                <Tooltip content="Xóa hàng hóa">
                  <Button color="failure">
                    <MdDelete />
                  </Button>
                </Tooltip>
              </div>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Magic Mouse 2
            </Table.Cell>
            <Table.Cell>Black</Table.Cell>
            <Table.Cell>Accessories</Table.Cell>
            <Table.Cell>$99</Table.Cell>
            <Table.Cell>
              <div className="flex  gap-1">
                <Tooltip content="Chi tiết hàng hóa">
                  <Button color="blue">
                    <FaCircleInfo />
                  </Button>
                </Tooltip>
                <Tooltip content="Cập nhật hàng hóa">
                  <Button>
                    <BsFillPencilFill />
                  </Button>
                </Tooltip>
                <Tooltip content="Xóa hàng hóa">
                  <Button color="failure">
                    <MdDelete />
                  </Button>
                </Tooltip>
              </div>
            </Table.Cell>
          </Table.Row> */}
        </Table.Body>
      </Table>
    </div>
  );
}
