export function hxQuery<T>(search: string | URLSearchParams, hxVals?: Record<string, string | number | boolean>) {
  const query: Record<string, string | number | boolean> = { ...hxVals };

  new URLSearchParams(search).forEach((value, key) => {
    const boo = value.toUpperCase();

    if (boo === "TRUE" || boo === "FALSE") {
      query[key] = (boo === "TRUE");
    } else {
      const num = Number(value);
      query[key] = (Number.isNaN(num) ? value : num);
    }
  });

  return query as T;
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
