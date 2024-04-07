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
pub struct CreateProduct {
    pub name: String,
    pub unit: String,
    pub gold_weight: Option<String>,
    pub gold_age: Option<String>,
    pub stone_weight: Option<String>,
    pub note: Option<String>,
    pub wage: Option<String>,
    pub stone_price: Option<String>,
    pub price: Option<String>,
    pub quantity: i64,
    pub category_id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub unit: String,
    pub gold_weight: Option<String>,
    pub gold_age: Option<String>,
    pub stone_weight: Option<String>,
    pub note: Option<String>,
    pub wage: Option<String>,
    pub stone_price: Option<String>,
    pub price: Option<String>,
    pub quantity: i64,
    pub category_id: i64,
    pub created_at: NaiveDateTime,
}
