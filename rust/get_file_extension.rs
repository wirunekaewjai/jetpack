use std::path::PathBuf;

pub fn get_file_extension(path: &PathBuf) -> Option<String> {
    let Some(file_extension) = path.extension() else {
        return None;
    };

    Some(file_extension.to_str().unwrap_or_default().to_lowercase())
}
