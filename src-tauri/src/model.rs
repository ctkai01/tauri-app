use chrono::{DateTime, Utc, NaiveDateTime};
use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
    // #[serde(with = "chrono::serde::ts_seconds")]
    pub created_at: NaiveDateTime,
    pub children: Vec<Category>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCategory {
    pub id: String,
    pub name: String,
    pub category_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCategory {
    pub id_old: String,
    pub id: String,
    pub name: String,
    pub category_id: Option<String>,
}