// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod database;
mod state;
mod model;
use model::{CreateCategory, Category};
use state::{AppState, ServiceAccess};
use tauri::{AppHandle, Manager, State};

#[tauri::command]
fn create_category(app_handle: AppHandle, data: String) ->  Result<(), String> {
    // Should handle errors instead of unwrapping here
    let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    app_handle.db(|db| database::add_category(create_category, db)).unwrap();

    // let items = app_handle.db(|db| database::get_all(db)).unwrap();
   Ok(())
}

#[tauri::command]
fn get_categories(app_handle: AppHandle) ->  Result<Vec<Category>, String> {
    // Should handle errors instead of unwrapping here
    // let create_category: CreateCategory = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    let categories = app_handle.db(|db| database::get_all_category(db)).unwrap();

    // let items = app_handle.db(|db| database::get_all(db)).unwrap();
   Ok(categories)
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            println!("{:?}", db);
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![create_category, get_categories])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
