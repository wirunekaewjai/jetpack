use actix_web::{
    http::{header::ETAG, StatusCode},
    HttpRequest, HttpResponseBuilder,
};

use super::{create_etag, is_not_modified};

pub fn bind_etag_header(builder: &mut HttpResponseBuilder, req: &HttpRequest, buffer: &Vec<u8>) {
    let etag = create_etag(buffer);
    let headers = req.headers();

    if is_not_modified(&headers, &etag) {
        builder.status(StatusCode::NOT_MODIFIED);
    }

    builder.insert_header((ETAG, etag));
}
