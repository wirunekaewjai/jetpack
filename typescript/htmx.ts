export function hxQuery(search: string | URLSearchParams, hxVals?: Record<string, string | number | boolean>) {
  const params = new URLSearchParams(search);
  const get = (key: string) => params.get(key) ?? hxVals?.[key];

  return {
    getBoolean: (key: string) => Boolean(get(key)),
    getNumber: (key: string) => Number(get(key)),
    getString: (key: string) => String(get(key)),
  };
}

export function hxResponse(xhr: XMLHttpRequest, response: {
  body: string;
  status?: number;
  statusText?: string;
  url: string;
}) {
  [
    "response",
    "responseText",
    "responseURL",
    "readyState",
    "status",
    "statusText",
  ].forEach((name) => Object.defineProperty(xhr, name, { writable: true }));

  // @ts-ignore
  xhr.response = xhr.responseText = response.body;

  // @ts-ignore
  xhr.responseURL = new URL(response.url, window.location.origin);

  // @ts-ignore
  xhr.readyState = XMLHttpRequest.DONE;

  // @ts-ignore
  xhr.status = response.status ?? 200;

  // @ts-ignore
  xhr.statusText = response.statusText ?? "OK";

  //
  xhr.onload?.(new ProgressEvent(""));
}
