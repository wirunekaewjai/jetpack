import type { Unsubscribe } from "./types/unsubscribe";

export type Callback = (pathname: string, query: URLSearchParams) => Promise<string | null | undefined> | string | null | undefined;

class HxGetInterceptor {
  callbacks: Callback[];

  constructor() {
    this.callbacks = [];

    const parent = this;
    const OriginalXMLHttpRequest = window.XMLHttpRequest;

    class InterceptedXMLHttpRequest extends OriginalXMLHttpRequest {
      headers: Record<string, string> = {};
      url: string | URL | undefined;

      setRequestHeader(name: string, value: string) {
        this.headers[name] = value;
        super.setRequestHeader(name, value);
      }

      open(method: string, url: string | URL): void;
      open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;
      open(...args: [string, string | URL]): void {
        this.url = args[1];
        super.open(...args);
      }

      async send(body: Document | XMLHttpRequestBodyInit | null | undefined) {
        const isHxRequest = this.headers["HX-Request"];

        if (!isHxRequest || !this.url) {
          return super.send(body);
        }

        const url = typeof this.url === "string" ? new URL(this.url, window.location.origin) : this.url;

        for (const callback of parent.callbacks) {
          const response = await callback(url.pathname, url.searchParams);

          if (typeof response === "string") {
            [
              "response",
              "responseText",
              "responseURL",
              "readyState",
              "status",
              "statusText",
            ].forEach((name) => Object.defineProperty(this, name, { writable: true }));

            // @ts-ignore
            this.response = this.responseText = response;

            // @ts-ignore
            this.responseURL = url.href;

            // @ts-ignore
            this.readyState = XMLHttpRequest.DONE;

            // @ts-ignore
            this.status = 200;

            // @ts-ignore
            this.statusText = "OK";

            this.onload?.(new ProgressEvent(""));
            return;
          }
        }

        return super.send(body);
      }
    }

    window.XMLHttpRequest = InterceptedXMLHttpRequest;
  }

  add(callback: Callback): Unsubscribe {
    this.callbacks.push(callback);

    return () => {
      this.callbacks = this.callbacks.filter((x) => x !== callback);
    };
  }
}

let interceptor: HxGetInterceptor;

export function onHxGet(callback: Callback) {
  if (!interceptor) {
    interceptor = new HxGetInterceptor();
  }

  return interceptor.add(callback);
}