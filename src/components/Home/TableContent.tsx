import { Button, Checkbox, Table, Tooltip } from "flowbite-react";
import * as React from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export interface ITableContentProps {}

export default function TableContent(props: ITableContentProps) {
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
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'Apple MacBook Pro 17"'}
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
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
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
