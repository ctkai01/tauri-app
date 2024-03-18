use rusqlite::{named_params, Connection};
use std::fs;
use tauri::AppHandle;

use crate::model::{Category, CreateCategory};

const CURRENT_DB_VERSION: u32 = 0;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("Gold.sqlite");

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
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;

        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            "
       CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        parent_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
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

pub fn add_category(data: CreateCategory, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
        "INSERT INTO categories (id, name, parent_id) VALUES (@id, @name, @category_id)",
    )?;
    statement.execute(named_params! {"@id": data.id, "@name": data.name,  "@category_id": data.category_id.unwrap_or_default() })?;

    Ok(())
}

pub fn get_all_category(db: &Connection) -> Result<Vec<Category>, rusqlite::Error> {
    let mut stmt = db.prepare("Select id, name, parent_id, created_at  FROM categories where parent_id = ''")?;

    let category_iter = stmt.query_map([], |row| {
        Ok(Category {
            id: row.get(0)?,
            name: row.get(1)?,
            parent_id: row.get(2)?,
            created_at: row.get(3)?,
            children: Vec::new(),
        })
    })?;
    let mut categories = vec![];
    for category_result in category_iter {
        let mut category = category_result?;

        // Query the database for children of the current category
        let mut children_stmt = db.prepare(
            "SELECT id, name, parent_id, created_at FROM categories WHERE parent_id = ?",
        )?;
        let children_iter = children_stmt.query_map(&[&category.id], |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                parent_id: row.get(2)?,
                created_at: row.get(3)?,
                children: Vec::new(), // Initialize an empty vector for children
            })
        })?;

        let mut children = Vec::new();
        for child_result in children_iter {
            children.push(child_result?);
        }

        // Assign children to the current category
        category.children = children;
        categories.push(category);
        // Print the current category and its children
    }

    // for person in children_iter {
    //     println!("Found person {:?}", person.unwrap());
    // }
    Ok(categories)
}

pub fn get_all(db: &Connection) -> Result<Vec<String>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM items")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()? {
        let title: String = row.get("title")?;

        items.push(title);
    }

    Ok(items)
}
