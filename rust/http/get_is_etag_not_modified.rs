use actix_web::http::header::{self, HeaderMap};

pub fn is_not_modified(headers: &HeaderMap, etag: &str) -> bool {
    let etag_req = headers.get(header::IF_NONE_MATCH);
    return etag_req.is_some() && etag_req.unwrap().eq(&etag);
}
