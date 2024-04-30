use chrono::NaiveDateTime;
use rusqlite::{named_params, params, Connection};
use std::fs;
use tauri::AppHandle;

use crate::model::{
    Category, CreateCategory, CreateProduct, DeleteCategory, DeleteProduct, GetProductsByCategory,
    GetProductsByCategoryRes, Product, ProductCreateResponse, ProductUpdateResponse,
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
        category_id INTEGER NOT NULL,
        gold_weight TEXT,

        percent_gold TEXT,
        stone_weight TEXT,
        total_weight TEXT,
        wage TEXT,
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
    data: &CreateProduct,
    db: &Connection,
) -> Result<ProductCreateResponse, rusqlite::Error> {
    let mut statement = db.prepare(
        "INSERT INTO products (name, category_id, gold_weight, percent_gold, stone_weight, total_weight, wage, quantity) VALUES (@name, @category_id, @gold_weight, @percent_gold, @stone_weight, @total_weight, @wage, @quantity)",
    )?;
    statement.execute(named_params! {
        "@name": data.name,
        "@category_id": data.category_id,
        "@gold_weight": data.gold_weight.as_deref().unwrap_or_default(),
        "@percent_gold": data.gold_percent.as_deref().unwrap_or_default(),
        "@stone_weight": data.stone_weight.as_deref().unwrap_or_default(),
        "@total_weight": data.total_weight,
        "@wage": data.wage.as_deref().unwrap_or_default(),
        "@quantity": data.quantity,
    })?;

    // Retrieve the ID of the last inserted row
    let id = db.last_insert_rowid();

    let add_product = ProductCreateResponse {
        id,
        category_id: data.category_id,
        name: data.name.clone(),
        gold_percent: data.gold_percent.clone(),
        gold_weight: data.gold_weight.clone(),
        quantity: data.quantity,
        stone_weight: data.stone_weight.clone(),
        total_weight: data.total_weight.to_string(),
        wage: data.wage.clone(),
    };
    Ok(add_product)
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

pub fn delete_product(data: DeleteProduct, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM products WHERE id = @id")?;
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
    data: &UpdateProduct,
    db: &Connection,
) -> Result<ProductUpdateResponse, rusqlite::Error> {
    println!("data update: {:?}", data);
    let mut statement = db.prepare(
        "UPDATE products SET name = @name, category_id = @category_id, gold_weight = @gold_weight, percent_gold = @percent_gold, stone_weight = @stone_weight, total_weight = @total_weight, wage = @wage, quantity = @quantity WHERE id = @id",
    )?;

    statement.execute(named_params! {"@name": data.name,  "@category_id": data.category_id,  "@gold_weight": data.gold_weight.as_deref().unwrap_or_default(), "@percent_gold": data.gold_percent.as_deref().unwrap_or_default(), "@stone_weight": data.stone_weight.as_deref().unwrap_or_default(),  "@total_weight": data.total_weight,  "@wage": data.wage.as_deref().unwrap_or_default(), "@quantity": data.quantity,  "@id": data.id })?;

    let update_product = ProductUpdateResponse {
        id: data.id,
        category_id: data.category_id,
        name: data.name.clone(),
        gold_percent: data.gold_percent.clone(),
        gold_weight: data.gold_weight.clone(),
        quantity: data.quantity,
        stone_weight: data.stone_weight.clone(),
        total_weight: data.total_weight.to_string(),
        wage: data.wage.clone(),
    };
    Ok(update_product)
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
    let mut stmt = db.prepare("Select *  FROM products WHERE id = ?")?;

    let mut rows = stmt.query(params![id])?;

    if let Some(row) = rows.next()? {
        Ok(Some(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            category_id: row.get(2)?,
            gold_weight: row.get(3)?,
            gold_percent: row.get(4)?,
            stone_weight: row.get(5)?,
            total_weight: row.get(6)?,
            wage: row.get(7)?,
            quantity: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        }))
    } else {
        Ok(None)
    }
}

pub fn get_products_by_category_id_paginate(
    db: &Connection,
    get_category_data: GetProductsByCategory,
) -> Result<GetProductsByCategoryRes, rusqlite::Error> {
    let offset = (get_category_data.page - 1) * get_category_data.limit;
    let count_sql = "SELECT COUNT(*) FROM products WHERE category_id = ?";
    let mut count_stmt = db.prepare(count_sql)?;

    let count_row = count_stmt.query_row([&get_category_data.category_id], |row| {
        row.get::<usize, i64>(0)
    })?;
    let total_count = count_row;
    let total_page = (total_count + get_category_data.limit - 1) / get_category_data.limit;
    let mut stmt;
    if get_category_data.search.is_empty() {
        stmt = db.prepare("SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?")?;

        let products_iter = stmt.query_map(
            [
                &get_category_data.category_id,
                &get_category_data.limit,
                &offset,
            ],
            |row| {
                Ok(Product {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    category_id: row.get(2)?,
                    gold_weight: row.get(3)?,
                    gold_percent: row.get(4)?,
                    stone_weight: row.get(5)?,
                    total_weight: row.get(6)?,
                    wage: row.get(7)?,
                    quantity: row.get(8)?,
                    created_at: row.get(9)?,
                    updated_at: row.get(10)?,
                })
            },
        )?;
        let mut products = vec![];
        for product_result in products_iter {
            let product = product_result?;
            products.push(product);
        }
        println!("categories: {:?}", products);
        Ok(GetProductsByCategoryRes {
            products,
            limit: get_category_data.limit,
            page: get_category_data.page,
            total_count,
            total_page,
        })
    } else {
        let search_param = format!("%{}%", get_category_data.search);
        stmt = db.prepare("SELECT * FROM products WHERE category_id = ? AND name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?")?;

        let products_iter = stmt.query_map(
            [
                &get_category_data.category_id.to_string(),
                &search_param,
                &get_category_data.limit.to_string(),
                &offset.to_string(),
            ],
            |row| {
                Ok(Product {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    category_id: row.get(2)?,
                    gold_weight: row.get(3)?,
                    gold_percent: row.get(4)?,
                    stone_weight: row.get(5)?,
                    total_weight: row.get(6)?,
                    wage: row.get(7)?,
                    quantity: row.get(8)?,
                    created_at: row.get(9)?,
                    updated_at: row.get(10)?,
                })
            },
        )?;
        let mut products = vec![];
        for product_result in products_iter {
            let product = product_result?;
            products.push(product);
        }
        println!("categories: {:?}", products);
        Ok(GetProductsByCategoryRes {
            products,
            limit: get_category_data.limit,
            page: get_category_data.page,
            total_count,
            total_page,
        })
    }
}

pub fn get_products_by_category_id(
    db: &Connection,
    id: i64,
) -> Result<Vec<Product>, rusqlite::Error> {
    let mut stmt = db.prepare("Select *  FROM products WHERE category_id = ?")?;

    let products_iter = stmt.query_map([&id], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            category_id: row.get(2)?,
            gold_weight: row.get(3)?,
            gold_percent: row.get(4)?,
            stone_weight: row.get(5)?,
            total_weight: row.get(6)?,
            wage: row.get(7)?,
            quantity: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
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
