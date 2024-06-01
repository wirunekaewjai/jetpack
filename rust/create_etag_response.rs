use actix_web::{
    http::header::{CacheControl, CacheDirective, CONTENT_TYPE, ETAG},
    HttpRequest, HttpResponse,
};
use mime::Mime;

use super::{create_etag, is_not_modified};

pub fn create_etag_response(req: &HttpRequest, mime: Mime, buffer: Vec<u8>) -> HttpResponse {
    let etag = create_etag(&buffer);
    let headers = req.headers();
    let mut builder = match is_not_modified(&headers, &etag) {
        true => HttpResponse::NotModified(),
        false => HttpResponse::Ok(),
    };

    return builder
        .insert_header(CacheControl(vec![
            CacheDirective::Public,
            CacheDirective::MaxAge(0),
            CacheDirective::MustRevalidate,
        ]))
        .insert_header((CONTENT_TYPE, mime))
        .insert_header((ETAG, etag))
        .body(buffer);
}
