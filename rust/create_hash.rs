use sha2::{Digest, Sha256};

pub fn create_hash(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();

    hasher.update(bytes);

    let result = hasher.finalize();

    format!("{:x}", result)
}
