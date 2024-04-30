use std::{collections::HashMap, fmt::format, fs};

use crate::model::Product;
use xlsxwriter::prelude::*;
use xlsxwriter::{Format, Workbook, Worksheet};
// const FONT_SIZE: f64 = 12.0;
pub fn create_xlsx(products: Vec<Product>, path: String) -> Result<(), XlsxError> {
    let path_save = format!("{}/gold.xlsx", path);
    let workbook = Workbook::new(path_save.as_str())?;
    let mut sheet1 = workbook.add_worksheet(None)?;
    sheet1.write_string(0, 0, "Tên", None)?;
    sheet1.write_string(0, 1, "Hàm lượng vàng", None)?;
    sheet1.write_string(0, 2, "Tổng lượng đá", None)?;
    sheet1.write_string(0, 3, "Tổng lượng vàng", None)?;
    sheet1.write_string(0, 4, "Tổng lượng tổng", None)?;
    sheet1.write_string(0, 5, "Công", None)?;
    sheet1.write_string(0, 6, "Số lượng", None)?;
    let mut row = 1;
    for product in products {
        let stone_weight_data = format!(
            "TLD: {}",
            product.stone_weight.unwrap_or("0.00".to_string())
        );
        let gold_weight_data =
            format!("TLV: {}", product.gold_weight.unwrap_or("0.00".to_string()));
        let total_weight_data = format!("TLT: {}", product.total_weight);
        let gold_percent_data = format!("HLV.au: {}", product.gold_percent.unwrap_or("0".to_string()));
        let wage_data = format!("C: {}", product.wage.unwrap_or("0.00".to_string()));
        let quantity_data = format!("{}", product.quantity);
        sheet1.write_string(row, 0, &product.name, None)?;
           sheet1.write_string(
            row,
            1,
            gold_percent_data.as_str(),
            None,
        )?;
        sheet1.write_string(
            row,
            2,
            stone_weight_data.as_str(),
            None,
        )?;
        sheet1.write_string(row, 3, gold_weight_data.as_str(), None)?;
        sheet1.write_string(row, 4, total_weight_data.as_str(), None)?;
        sheet1.write_string(row, 5, wage_data.as_str(), None)?;
        sheet1.write_string(row, 6, quantity_data.as_str(), None)?;

        row += 1
    }

    workbook.close()?;
    //   let _ = sheet.write_string(0, 0, "Tên", None);
    //     let _ = sheet.write_string(0, 1, "Tổng lượng đá", None);
    //     let _ = sheet.write_string(0, 2, "Tổng lượng vàng", None);
    //     let _ = sheet.write_string(0, 3, "Tổng lượng tổng", None);
    //     let _ = sheet.write_string(0, 4, "Công", None);
    //     let _ = sheet.write_string(0, 5, "Số lượng", None);
    Ok(())
    //   let name = "Product.xlsx";
    // let workbook = Workbook::new(name);
    // let mut sheet = workbook.add_worksheet(None).expect("can add sheet");

    // let mut width_map: HashMap<u16, usize> = HashMap::new();

    // create_headers(&mut sheet, &mut width_map);

    // let fmt = workbook
    //     .add_format()
    //     .set_text_wrap()
    //     .set_font_size(FONT_SIZE);

    // for (i, v) in values.iter().enumerate() {
    //     add_row(i as u32, &v, &mut sheet, &mut width_map);
    // }

    // width_map.iter().for_each(|(k, v)| {
    //     let _ = sheet.set_column(*k as u16, *k as u16, *v as f64 * 1.2, Some(&fmt));
    // });

    // workbook.close().expect("workbook can be closed");

    // let result = fs::read(&name).expect("can read file");
    // // remove_file(&uuid).expect("can delete file");
    //  let mut file_content = Vec::new();
    // let mut file = fs::File::open(&name).expect("can open file");
    // file.read_to_end(&mut file_content).expect("can read file");
    // result
}

// fn add_row(
//     row: u32,
//     product: &Product,
//     sheet: &mut Worksheet,
//     width_map: &mut HashMap<u16, usize>,
// ) {
//     let stone_weight_data = format!(
//         "TLD: {}",
//         product.stone_weight.unwrap_or("0.00".to_string())
//     );
//     let gold_weight_data = format!("TLV: {}", product.gold_weight.unwrap_or("0.00".to_string()));
//     let total_weight_data = format!("TLT: {}", product.total_weight);
//     let wage_data = format!("C: {}", product.wage.unwrap_or("0.00".to_string()));
//     let quantity_data = format!("{}", product.quantity);
//     add_string_column(row, 0, &product.name, sheet, width_map);
//     add_string_column(row, 1, &stone_weight_data, sheet, width_map);
//     add_string_column(row, 2, &gold_weight_data, sheet, width_map);
//     add_string_column(row, 3, &total_weight_data, sheet, width_map);
//     add_string_column(row, 4, &wage_data, sheet, width_map);
//     add_string_column(row, 5, &quantity_data, sheet, width_map);

//     let _ = sheet.set_row(row, FONT_SIZE, None);
// }

// fn add_string_column(
//     row: u32,
//     column: u16,
//     data: &str,
//     sheet: &mut Worksheet,
//     mut width_map: &mut HashMap<u16, usize>,
// ) {
//     let _ = sheet.write_string(row + 1, column, data, None);
//     set_new_max_width(column, data.len(), &mut width_map);
// }

// fn set_new_max_width(col: u16, new: usize, width_map: &mut HashMap<u16, usize>) {
//     match width_map.get(&col) {
//         Some(max) => {
//             if new > *max {
//                 width_map.insert(col, new);
//             }
//         }
//         None => {
//             width_map.insert(col, new);
//         }
//     };
// }

// fn create_headers(sheet: &mut Worksheet, mut width_map: &mut HashMap<u16, usize>) {
//     let _ = sheet.write_string(0, 0, "Tên", None);
//     let _ = sheet.write_string(0, 1, "Tổng lượng đá", None);
//     let _ = sheet.write_string(0, 2, "Tổng lượng vàng", None);
//     let _ = sheet.write_string(0, 3, "Tổng lượng tổng", None);
//     let _ = sheet.write_string(0, 4, "Công", None);
//     let _ = sheet.write_string(0, 5, "Số lượng", None);

//     set_new_max_width(0, "Tên".len(), &mut width_map);
//     set_new_max_width(1, "Tổng lượng đá".len(), &mut width_map);
//     set_new_max_width(2, "Tổng lượng vàng".len(), &mut width_map);
//     set_new_max_width(3, "Tổng lượng tổng".len(), &mut width_map);
//     set_new_max_width(4, "Công".len(), &mut width_map);
//     set_new_max_width(5, "Số lượng".len(), &mut width_map);
// }
