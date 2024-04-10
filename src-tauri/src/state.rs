use rusqlite::Connection;
use tauri::{AppHandle, State, Manager, Config};

pub struct AppState {
  pub db: std::sync::Mutex<Option<Connection>>,
  pub path_image: std::sync::Mutex<String>,
  // pub config: std::sync::Mutex<&'a Config>
}

pub trait ServiceAccess {
  fn db<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&Connection) -> TResult;

  fn db_mut<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut Connection) -> TResult;
  fn path_image(&self) -> String;
}

impl ServiceAccess for AppHandle {
  fn db<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&Connection) -> TResult {
    let app_state: State<AppState> = self.state();
    let db_connection_guard = app_state.db.lock().unwrap();
    let db = db_connection_guard.as_ref().unwrap();
  
    operation(db)
  }

  fn path_image(&self) -> String {
    let app_state: State<AppState> = self.state();
    let identifier = app_state.path_image.lock().unwrap().to_string();
    identifier
  }

  fn db_mut<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut Connection) -> TResult {
    let app_state: State<AppState> = self.state();
    let mut db_connection_guard = app_state.db.lock().unwrap();
    let db = db_connection_guard.as_mut().unwrap();
  
    operation(db)
  }
}