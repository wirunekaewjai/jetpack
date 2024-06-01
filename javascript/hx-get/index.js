/**
 * @param {import('./types').Callback} callback 
 */
export function hxGet(callback) {
  const OriginalXMLHttpRequest = window.XMLHttpRequest;

  class InterceptedXMLHttpRequest extends OriginalXMLHttpRequest {
    /** @type {Record<string, string>} */
    headers = {};

    /** @type {string | URL | undefined} */
    url;

    /**
     * @param {string} name 
     * @param {string} value 
     */
    setRequestHeader(name, value) {
      this.headers[name] = value;
      super.setRequestHeader(name, value);
    }

    /**
     * @param {string} method
     * @param {string | URL} url
     * @param {...any} args 
     */
    open(method, url, ...args) {
      this.url = url;
      super.open(method, url, ...args);
    }

    async send(body) {
      const isHxRequest = this.headers["HX-Request"];

      if (!isHxRequest || !this.url) {
        return super.send(body);
      }

      const url = typeof this.url === "string" ? new URL(this.url, window.location.origin) : this.url;
      const response = await callback(url.pathname, url.searchParams);

      if (typeof response !== "string") {
        return super.send(body);
      }

      [
        "response",
        "responseText",
        "responseURL",
        "readyState",
        "status",
        "statusText",
      ].forEach((name) => Object.defineProperty(this, name, { writable: true }));

      this.response = this.responseText = response;
      this.responseURL = url.href;
      this.readyState = XMLHttpRequest.DONE;
      this.status = 200;
      this.statusText = "OK";

      this.onload?.(new ProgressEvent(""));
    }
  };

  window.XMLHttpRequest = InterceptedXMLHttpRequest;
}