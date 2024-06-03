use crate::create_sha256_hash;

pub fn create_etag(bytes: &[u8]) -> String {
    let hash = create_sha256_hash(bytes);
    format!("\"{hash}\"")
}
