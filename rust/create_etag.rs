use super::create_hash;

pub fn create_etag(bytes: &[u8]) -> String {
    let hash = create_hash(bytes);
    format!("\"{hash}\"")
}
