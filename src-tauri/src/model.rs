use chrono::{DateTime, NaiveDateTime, Utc};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub parent_id: Option<i64>,
    // #[serde(with = "chrono::serde::ts_seconds")]
    pub created_at: NaiveDateTime,
    pub children: Vec<Category>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCategory {
    pub code: String,
    pub name: String,
    pub parent_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCategory {
    pub code: String,
    pub id: i64,
    pub name: String,
    pub parent_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteCategory {
    pub id: i64,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteProduct {
    pub id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProduct {
    pub name: String,
    // pub unit: String,
    pub gold_weight: Option<String>,
    pub gold_percent: Option<String>,
    pub stone_weight: Option<String>,
    pub total_weight: f32,
    // pub image: Option<SaveImageToFilePayload>,
    // pub note: Option<String>,
    pub wage: Option<String>,
    // pub stone_price: Option<String>,
    // pub price: Option<String>,
    pub quantity: i64,
    pub category_id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProduct {
    pub id: i64,
    pub name: String,
    // pub unit: String,
    pub gold_weight: Option<String>,
    pub gold_percent: Option<String>,
    pub stone_weight: Option<String>,
    pub total_weight: f32,
    // pub image: Option<SaveImageToFilePayload>,
    // pub note: Option<String>,
    pub wage: Option<String>,
    // pub stone_price: Option<String>,
    // pub price: Option<String>,
    pub quantity: i64,
    pub category_id: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: i64,
    pub name: String,
    // pub unit: String,
    pub total_weight: String,
    pub gold_weight: Option<String>,
    pub gold_percent: Option<String>,
    pub stone_weight: Option<String>,
    // pub note: Option<String>,
    pub wage: Option<String>,
    // pub stone_price: Option<String>,
    // pub price: Option<String>,
    pub quantity: i64,
    // pub image: Option<String>,
    pub category_id: i64,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductUpdateResponse {
    pub id: i64,
    pub name: String,
    // pub unit: String,
    pub total_weight: String,
    pub gold_weight: Option<String>,
    pub gold_percent: Option<String>,
    pub stone_weight: Option<String>,
    // pub note: Option<String>,
    pub wage: Option<String>,
    // pub stone_price: Option<String>,
    // pub price: Option<String>,
    pub quantity: i64,
    // pub image: Option<String>,
    pub category_id: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductCreateResponse {
    pub id: i64,
    pub name: String,
    // pub unit: String,
    pub total_weight: String,
    pub gold_weight: Option<String>,
    pub gold_percent: Option<String>,
    pub stone_weight: Option<String>,
    // pub note: Option<String>,
    pub wage: Option<String>,
    // pub stone_price: Option<String>,
    // pub price: Option<String>,
    pub quantity: i64,
    // pub image: Option<String>,
    pub category_id: i64,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct SaveImageToFilePayload {
  pub image_data: Vec<u8>, // Assuming the image file data is sent as a byte array
  pub file_name: String,   // The name of the file to save the image to
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GetProductsByCategory {
  pub category_id: i64, // Assuming the image file data is sent as a byte array
  pub page: i64,   // The name of the file to save the image to
  pub limit: i64,   // The name of the file to save the image to
  pub search: String,   // The name of the file to save the image to
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GetProductsByCategoryRes {
  pub products: Vec<Product>, // Assuming the image file data is sent as a byte array
  pub page: i64,  
  pub limit: i64,  
  pub total_page: i64,   
  pub total_count: i64,   
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PrintProduct {
    pub products: Vec<Product>,
}