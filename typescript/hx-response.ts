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

/* Example
const onHtmxBeforeRequest = (e: CustomEvent) => {
  const conf = e.detail.requestConfig as {
    path: string;
    parameters: Record<string, any>;
  };

  const [pathname, search] = conf.path.split("?");

  if (pathname === "/@count") {
    const hxVals = conf.parameters;
    const query = new URLSearchParams(search);

    const name = query.get("name") ?? hxVals.name;
    const value = Number(query.get("value") ?? hxVals.value);

    hxResponse(e.detail.xhr, {
      body: counter(name, value),
      url: conf.path,
    });

    return;
  }
};

htmx.on("htmx:beforeRequest", (e) => {
  return onHtmxBeforeRequest(e as CustomEvent);
});
 */