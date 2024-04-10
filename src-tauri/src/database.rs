use rusqlite::{named_params, Connection};
use std::fs;
use tauri::AppHandle;

use crate::model::{
    Category, CreateCategory, CreateProduct, DeleteCategory, GetProductsByCategory, Product,
    UpdateCategory, UpdateProduct,
};

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("Gold5.sqlite");

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
        category_id INTEGER NOT NULL,
        image TEXT,
        gold_weight TEXT,
        note TEXT,
        age_gold TEXT,
        stone_weight TEXT,
        total_weight TEXT,
        wage TEXT,
        stone_price TEXT,
        price TEXT,
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

pub fn add_product(
    data: CreateProduct,
    image_path: String,
    db: &Connection,
) -> Result<i64, rusqlite::Error> {
    let mut statement = db.prepare(
        "INSERT INTO products (name, unit, category_id, image, gold_weight, note, age_gold, stone_weight, total_weight, wage, stone_price, price, quantity) VALUES (@name, @unit, @category_id, @image, @gold_weight, @note, @age_gold, @stone_weight, @total_weight, @wage, @stone_price, @price, @quantity)",
    )?;
    statement.execute(named_params! {
        "@name": data.name,
        "@unit": data.unit,
        "@category_id": data.category_id,
        "@image": image_path,
        "@gold_weight": data.gold_weight.unwrap_or_default(),
        "@note": data.note.unwrap_or_default(),
        "@age_gold": data.gold_age.unwrap_or_default(),
        "@stone_weight": data.stone_weight.unwrap_or_default(),
        "@total_weight": data.total_weight,
        "@wage": data.wage.unwrap_or_default(),
        "@stone_price": data.stone_price.unwrap_or_default(),
        "@price": data.price,
        "@quantity": data.quantity,
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

pub fn update_product(
    data: UpdateProduct,
    db: &Connection,
    image_path: String,
) -> Result<(), rusqlite::Error> {
    println!("data update: {:?}", data);
    let mut statement = db.prepare(
        "UPDATE products SET name = @name, unit = @unit, category_id = @category_id, image = @image, gold_weight = @gold_weight, note = @note, age_gold = @age_gold, stone_weight = @stone_weight, total_weight = @total_weight, wage = @wage, stone_price = @stone_price, price = @price, quantity = @quantity WHERE id = @id",
    )?;
    statement.execute(named_params! {"@name": data.name, "@unit": data.unit,  "@category_id": data.category_id, "@image": image_path,  "@gold_weight": data.gold_weight.unwrap_or_default(), "@note": data.note.unwrap_or_default(), "@age_gold": data.gold_age.unwrap_or_default(), "@stone_weight": data.stone_weight.unwrap_or_default(),  "@total_weight": data.total_weight.unwrap_or_default(),  "@wage": data.wage.unwrap_or_default(), "@stone_price": data.stone_price.unwrap_or_default(), "@price": data.price.unwrap_or_default(), "@quantity": data.quantity.unwrap_or_default(),  "@id": data.id })?;

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
        let mut category = category_result?;
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

pub fn get_product_by_id(db: &Connection, id: i64) -> Result<Option<Product>, rusqlite::Error> {
     let mut stmt = db.prepare("Select image  FROM products WHERE id = ?")?;

    let products_iter = stmt.query_map([&id], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            unit: row.get(2)?,
            category_id: row.get(3)?,
            image: row.get(4)?,
            gold_weight: row.get(5)?,
            note: row.get(6)?,
            gold_age: row.get(7)?,
            stone_weight: row.get(8)?,
            total_weight: row.get(9)?,
            wage: row.get(10)?,
            stone_price: row.get(11)?,
            price: row.get(12)?,
            quantity: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    })?;
    Ok(None)
}

pub fn get_products_by_category_id_paginate(
    db: &Connection,
    get_category_data: GetProductsByCategory,
) -> Result<Vec<Product>, rusqlite::Error> {
    let mut stmt = db.prepare("Select *  FROM products WHERE category_id = ?")?;

    let products_iter = stmt.query_map([&get_category_data.category_id], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            unit: row.get(2)?,
            category_id: row.get(3)?,
            image: row.get(4)?,
            gold_weight: row.get(5)?,
            note: row.get(6)?,
            gold_age: row.get(7)?,
            stone_weight: row.get(8)?,
            total_weight: row.get(9)?,
            wage: row.get(10)?,
            stone_price: row.get(11)?,
            price: row.get(12)?,
            quantity: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    })?;
    let mut products = vec![];
    for product_result in products_iter {
        let product = product_result?;
        products.push(product);
    }
    println!("categories: {:?}", products);
    Ok(products)
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
