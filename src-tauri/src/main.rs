// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod database;
mod model;
mod state;
mod util;
use model::{
    Category, CreateCategory, CreateProduct, DeleteProduct, GetProductsByCategory, GetProductsByCategoryRes, Product, ProductCreateResponse, ProductUpdateResponse, UpdateCategory
};
use state::{AppState, ServiceAccess};
use std::{
    fs::{self, File},
    sync::{Arc, Mutex},
};
use tauri::{api::path::BaseDirectory, utils::config, AppHandle, Config, Manager, State};
use util::save_image;

use crate::model::{DeleteCategory, UpdateProduct};

#[tauri::command]
fn create_category(app_handle: AppHandle, data: String) -> Result<i64, String> {
    // Should handle errors instead of unwrapping here
    let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    println!("create_category: {:?}", create_category);
    let id = app_handle
        .db(|db| database::add_category(create_category, db))
        .unwrap();

    // let items = app_handle.db(|db| database::get_all(db)).unwrap();
    Ok(id)
}

#[tauri::command]
fn create_product(app_handle: AppHandle, data: String) -> Result<ProductCreateResponse, String> {
    // Should handle errors instead of unwrapping here
    let create_product: CreateProduct = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    let image_path = match &create_product.image {
        Some(data) => {
            match save_image(&data.file_name, &data.image_data, app_handle.path_image()) {
                Ok(path) => path,
                Err(e) => return Err(e), // Propagate the error if save_image fails
            }
        }
        None => "".to_string(),
    };

    let created_product = app_handle
        .db(|db| database::add_product(&create_product, image_path, db))
        .unwrap();
    Ok(created_product)
}

#[tauri::command]
fn update_product(app_handle: AppHandle, data: String) -> Result<ProductUpdateResponse, String> {
    // Should handle errors instead of unwrapping here
    let update_product: UpdateProduct = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    let product = app_handle
        .db(|db| database::get_product_by_id(db, update_product.id))
        .unwrap();
    println!("update_product.id: {:?}", update_product.id);
    if product.is_none() {
        return Err(String::from("Product not found"));
    }

    let image_path = match &update_product.image {
        Some(data) => {
            //Remove old
            if product.clone().unwrap().image.is_some() {
                match fs::remove_file(product.unwrap().image.unwrap()) {
                    Ok(_) => {}
                    Err(err) => {
                        println!("Error remove image: {:?}", err)
                    }
                }
            }

            match save_image(&data.file_name, &data.image_data, app_handle.path_image()) {
                Ok(path) => path,
                Err(e) => return Err(e), // Propagate the error if save_image fails
            }
        }
        None => product.unwrap().image.unwrap_or_default(),
    };

    let product_update = app_handle
        .db(|db| database::update_product(&update_product, db, image_path))
        .unwrap();
    Ok(product_update)
}

#[tauri::command]
fn get_product_by_category(app_handle: AppHandle, data: String) -> Result<GetProductsByCategoryRes, String> {
    // Should handle errors instead of unwrapping here
    let get_category_data: GetProductsByCategory =
        serde_json::from_str(&data).map_err(|e| e.to_string())?;

    let get_products_by_category_res = app_handle
        .db(|db| database::get_products_by_category_id_paginate(db, get_category_data))
        .unwrap();
    // let items = app_handle.db(|db| database::get_all(db)).unwrap();
    Ok(get_products_by_category_res)
}

#[tauri::command]
fn get_categories(app_handle: AppHandle) -> Result<Vec<Category>, String> {
    // Should handle errors instead of unwrapping here
    // let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    let categories = app_handle
        .db(|db| database::get_all_category_root(db))
        .unwrap();
    println!("categories: {:?}", categories);
    // let items = app_handle.db(|db| database::get_all(db)).unwrap();
    Ok(categories)
}

#[tauri::command]
fn get_categories_all(app_handle: AppHandle) -> Result<Vec<Category>, String> {
    // Should handle errors instead of unwrapping here
    // let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    let categories = app_handle.db(|db| database::get_all_category(db)).unwrap();

    // let items = app_handle.db(|db| database::get_all(db)).unwrap();
    Ok(categories)
}

#[tauri::command]
fn update_category(app_handle: AppHandle, data: String) -> Result<(), String> {
    // Should handle errors instead of unwrapping here
    // let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    let update_category: UpdateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    println!("update_category: {:?}", update_category);
    let result = app_handle.db(|db| database::update_category(update_category, db));

    match result {
        Ok(_) => {}
        Err(err) => {
            println!("Err: {:?}", err)
        }
    }

    Ok(())
}

#[tauri::command]
fn delete_category(app_handle: AppHandle, data: String) -> Result<(), String> {
    // Should handle errors instead of unwrapping here
    // let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    let delete_category: DeleteCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    // Delete image of product
    let products =
        app_handle.db(|db| database::get_products_by_category_id(db, delete_category.id)).unwrap();

    for product in products {
        match product.image {
            Some(path_image) => match fs::remove_file(path_image) {
                Ok(_) => {}
                Err(err) => {
                    println!("Error remove image: {:?}", err)
                }
            },
            None => {}
        }
    }

    let result = app_handle.db(|db| database::delete_category(delete_category, db));

    match result {
        Ok(_) => {
             Ok(())
        }
        Err(err) => Err(String::from(err.to_string())),
    }

   
}

#[tauri::command]
fn delete_product(app_handle: AppHandle, data: String) -> Result<(), String> {
    // Should handle errors instead of unwrapping here
    let delete_product_data: DeleteProduct =
        serde_json::from_str(&data).map_err(|e| e.to_string())?;

    let product = app_handle
        .db(|db| database::get_product_by_id(db, delete_product_data.id))
        .unwrap();

    if product.is_none() {
        return Err(String::from("Product not found"));
    }

    if product.clone().unwrap().image.is_some() {
        match fs::remove_file(product.unwrap().image.unwrap()) {
            Ok(_) => {}
            Err(err) => {
                println!("Error remove image: {:?}", err)
            }
        }
    }

    let result = app_handle.db(|db| database::delete_product(delete_product_data, db));

    match result {
        Ok(_) => {}
        Err(err) => return Err(String::from(err.to_string())),
    }

    Ok(())
}
fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
            path_image: Default::default(),
        })
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            println!("{:?}", db);
            *app_state.db.lock().unwrap() = Some(db);
            let identifier = handle
                .path_resolver()
                .app_data_dir()
                .unwrap_or(std::path::PathBuf::new())
                .to_string_lossy()
                .to_string()
                .split("/")
                .last()
                .unwrap()
                .to_string();
            *app_state.path_image.lock().unwrap() = identifier;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_category,
            get_categories,
            update_category,
            get_categories_all,
            delete_category,
            create_product,
            get_product_by_category,
            update_product,
            delete_product
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
