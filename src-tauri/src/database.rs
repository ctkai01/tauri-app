use rusqlite::{named_params, Connection};
use std::fs;
use tauri::AppHandle;

use crate::model::{Category, CreateCategory, DeleteCategory, UpdateCategory, CreateProduct};

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("Gold3.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| Ok(row.get(0)?))?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

/// Upgrades the database to the current version.
pub fn upgrade_database_if_needed(
    db: &mut Connection,
    existing_version: u32,
) -> Result<(), rusqlite::Error> {
    println!("existing_version: {:?}", existing_version);
    println!("CURRENT_DB_VERSION: {:?}", CURRENT_DB_VERSION);

    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;
        println!("HELLO");
        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            "
       CREATE TABLE IF NOT EXISTS categories (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        parent_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        category_id TEXT,
        image TEXT,
        gold_weight REAL,
        note TEXT,
        age_gold INTEGER,
        stone_weight REAL,
        total_weight REAL,
        wage REAL,
        stone_price REAL,
        price REAL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );
     ",
        )?;

        tx.commit()?;
    }

    Ok(())
}

pub fn add_category(data: CreateCategory, db: &Connection) -> Result<i64, rusqlite::Error> {
    let mut statement = db.prepare(
        "INSERT INTO categories (name, parent_id, code) VALUES (@name, @parent_id,  @code)",
    )?;
    statement.execute(named_params! {
        "@name": data.name,
        "@parent_id": data.parent_id.unwrap_or_default(),
        "@code": data.code,
    })?;

    // Retrieve the ID of the last inserted row
    let id = db.last_insert_rowid();

    Ok(id)
}

pub fn add_product(data: CreateProduct, db: &Connection) -> Result<i64, rusqlite::Error> {
    let mut statement = db.prepare(
        "INSERT INTO products (name, unit, category_id, image, gold_weight, note, age_gold, stone_weight, total_weight, wage, stone_price, price, quantity) VALUES (@name, @unit, @category_id, @image, gold_weight, note, age_gold, stone_weight, total_weight, wage, stone_price, price, quantity)",
    )?;
    statement.execute(named_params! {
        "@name": data.name,
        "@parent_id": data.parent_id.unwrap_or_default(),
        "@code": data.code,
    })?;

    // Retrieve the ID of the last inserted row
    let id = db.last_insert_rowid();

    Ok(id)
}

pub fn delete_category(data: DeleteCategory, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM categories WHERE id = @id")?;
    statement.execute(named_params! {
        "@id": data.id,
    })?;

    let mut statement = db.prepare("DELETE FROM categories WHERE parent_id = @id")?;
    statement.execute(named_params! {
        "@id": data.id,
    })?;

    Ok(())
}

pub fn update_category(data: UpdateCategory, db: &Connection) -> Result<(), rusqlite::Error> {
    println!("data update: {:?}", data);
    let mut statement = db.prepare(
        "UPDATE categories SET code = @code, name = @name, parent_id = @parent_id WHERE id = @id",
    )?;
    statement.execute(named_params! {"@code": data.code, "@name": data.name,  "@parent_id": data.parent_id.unwrap_or_default(), "@id": data.id })?;

    Ok(())
}

pub fn get_all_category_root(db: &Connection) -> Result<Vec<Category>, rusqlite::Error> {
    // let mut stmt = db.prepare(
    //     "Select ID, code, name, parent_id, created_at FROM categories where parent_id = 0",
    // )?;

    // let category_iter = stmt.query_map([], |row| {
    //     Ok(Category {
    //         id: row.get(0)?,
    //         code: row.get(1)?,
    //         name: row.get(2)?,
    //         parent_id: row.get(3)?,
    //         created_at: row.get(4)?,
    //         children: Vec::new(),
    //     })
    // })?;
    // let mut categories = vec![];
    // for category_result in category_iter {
    //     let mut category = category_result?;
    //      category.children =  get_categories(db, category.id)?
    //     // // Query the database for children of the current category
    //     // let mut children_stmt = db.prepare(
    //     //     "SELECT ID, code, name, parent_id, created_at FROM categories WHERE parent_id = ?",
    //     // )?;
    //     // let children_iter = children_stmt.query_map(&[&category.id], |row| {
    //     //     Ok(Category {
    //     //         id: row.get(0)?,
    //     //         code: row.get(1)?,
    //     //         name: row.get(2)?,
    //     //         parent_id: row.get(3)?,
    //     //         created_at: row.get(4)?,
    //     //         children: Vec::new(), // Initialize an empty vector for children
    //     //     })
    //     // })?;

    //     // let mut children = Vec::new();
    //     // for child_result in children_iter {
    //     //     children.push(child_result?);
    //     // }

    //     // // Assign children to the current category
    //     // category.children = children;
    //     // categories.push(category);
    //     // Print the current category and its children
    // }
    let categories = get_categories(db, 0)?;
    println!("categories result: {:?}", categories);
    Ok(categories)
}

fn get_categories(db: &Connection, id: i64) -> Result<Vec<Category>, rusqlite::Error> {
    let mut stmt = db.prepare(
        "SELECT ID, code, name, parent_id, created_at FROM categories WHERE parent_id = ?",
    )?;
    let category_iter = stmt.query_map([id], |row| {
        Ok(Category {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            parent_id: row.get(3)?,
            created_at: row.get(4)?,
            children: Vec::new(),
        })
    })?;

    let mut categories = vec![];
    for category_result in category_iter {
        let  mut category = category_result?;
            println!("categories result: {:?}", category);

        if category.parent_id.is_some() {
            category.children = get_categories(db, category.id)?
        }
        categories.push(category);
    }
    Ok(categories)
}

pub fn get_all_category(db: &Connection) -> Result<Vec<Category>, rusqlite::Error> {
    let mut stmt = db.prepare("Select ID, name, code, parent_id, created_at  FROM categories")?;

    let category_iter = stmt.query_map([], |row| {
        Ok(Category {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            parent_id: row.get(3)?,
            created_at: row.get(4)?,
            children: Vec::new(),
        })
    })?;
    let mut categories = vec![];
    for category_result in category_iter {
        let category = category_result?;
        categories.push(category);
    }
    println!("categories: {:?}", categories);
    Ok(categories)
}

// pub fn get_all(db: &Connection) -> Result<Vec<String>, rusqlite::Error> {
//     let mut statement = db.prepare("SELECT * FROM items")?;
//     let mut rows = statement.query([])?;
//     let mut items = Vec::new();
//     while let Some(row) = rows.next()? {
//         let title: String = row.get("title")?;

//         items.push(title);
//     }

//     Ok(items)
// }
