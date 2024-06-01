pub fn escape_quot<T: std::fmt::Display>(value: &T) -> String {
    value.to_string().replace('"', "&quot;")
}
