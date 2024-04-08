use std::{fs::File, time::{SystemTime, UNIX_EPOCH}};

pub fn save_image(file_path: &String, file_data: &Vec<u8>) -> Result<String, String> {
    let directory_path = tauri::api::path::local_data_dir().unwrap();
    // // Combine the directory path with the file name to get the full file path
   let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
   let file_name_with_timestamp = format!("{}_{}", timestamp, file_path);
    let full_file_path = directory_path.join(&file_name_with_timestamp);
    println!("A: {:?}", full_file_path);

    // // Open or create the file
    let mut file = match File::create(&full_file_path) {
        Ok(f) => f,
        Err(e) => return Err(format!("Failed to create file: {}", e)),
    };
   
    // // Write the binary data to the file
    // file.
    match std::io::Write::write_all(&mut file, &file_data) {
        Ok(_) => Ok(full_file_path.to_string_lossy().to_string()),
        Err(e) => Err(format!("Failed to write to file: {}", e)),
    }
}
