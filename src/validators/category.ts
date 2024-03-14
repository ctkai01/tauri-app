import { CreateCategory, UpdateCategory } from "../models";
import *  as Yup from 'yup'
export const schemeCreateCategory: Yup.ObjectSchema<CreateCategory> = Yup.object({
  name: Yup.string()
    .required("Tên nhóm hàng là bắt buộc")
    .min(1, "Tên nhóm hàng  nhỏ hơn 1 ký tự")
    .max(50, "Tên nhóm hàng  lớn hơn 50 ký tự"),
  id: Yup.string()
    .required("Mã nhóm hàng là bắt buộc")
    .min(1, "Mã nhóm hàng nhỏ hơn 1 ký tự")
    .max(30, "Mã nhóm hàng lớn hơn 30 ký tự"),
});


export const schemeUpdateCategory: Yup.ObjectSchema<UpdateCategory> =
  Yup.object({
    name: Yup.string()
      .min(1, "Tên nhóm hàng  nhỏ hơn 1 ký tự")
      .max(50, "Tên nhóm hàng  lớn hơn 50 ký tự"),
    id: Yup.string()
      .min(1, "Mã nhóm hàng nhỏ hơn 1 ký tự")
      .max(30, "Mã nhóm hàng lớn hơn 30 ký tự"),
  });
