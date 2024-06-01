use std::path::Path;

use actix_files::file_extension_to_mime;
use mime::{Mime, TEXT_PLAIN};

use super::get_file_extension;

pub fn get_file_mime(file_path: &str) -> Mime {
    let path = Path::new(&file_path).to_path_buf();
    let extension = get_file_extension(&path);

    let mime = match extension {
        Some(e) => file_extension_to_mime(&e),
        None => TEXT_PLAIN,
    };

    mime
}
