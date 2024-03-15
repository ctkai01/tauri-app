import { CreateCategory, CreateProduct, UpdateCategory } from "../models";
import *  as Yup from 'yup'

const MAX_FILE_SIZE = 1024 * 1024 * 5; //5MB

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];


export const schemeCreateProduct: Yup.ObjectSchema<CreateProduct> = Yup.object({
  name: Yup.string()
    .required("Tên mặt hàng là bắt buộc")
    .min(1, "Tên mặt hàng  nhỏ hơn 1 ký tự")
    .max(50, "Tên mặt hàng  lớn hơn 50 ký tự"),
  unit: Yup.string()
    .required("Đơn vi là bắt buộc")
    .min(1, "Đơn vi nhỏ hơn 1 ký tự")
    .max(50, "Đơn vi lớn hơn 30 ký tự"),
  image: Yup.mixed<File>()
    .test(
      "fileFormat",
      "Không hỗ trợ định dạng",
      (file) =>
        !file || // Check if `file` is defined
        file.length === 0 || // Check if `file` is not an empty list
        SUPPORTED_FORMATS.includes(file.type)
    )
    .test(
      "fileSize",
      "Tập tin quá lớn. Tối đa 5 MB",
      (file) =>
        !file || // Check if `file` is defined
        file.length === 0 || // Check if `files` is not an empty list
        file.size <= MAX_FILE_SIZE
    ),
  goldWeight: Yup.number(),
  goldAge: Yup.number(),
  stoneWeight: Yup.number(),
  wage: Yup.number(),
  stonePrice: Yup.number(),
  price: Yup.string(),
  note: Yup.string()
    .min(1, "Ghi chú nhỏ hơn 1 ký tự")
    .max(50, "Ghi chú lớn hơn 30 ký tự"),
});


// export const schemeUpdateCategory: Yup.ObjectSchema<UpdateCategory> =
//   Yup.object({
//     name: Yup.string()
//       .min(1, "Tên nhóm hàng  nhỏ hơn 1 ký tự")
//       .max(50, "Tên nhóm hàng  lớn hơn 50 ký tự"),
//     id: Yup.string()
//       .min(1, "Mã nhóm hàng nhỏ hơn 1 ký tự")
//       .max(30, "Mã nhóm hàng lớn hơn 30 ký tự"),
//   });
