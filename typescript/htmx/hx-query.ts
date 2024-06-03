export function hxQuery(search: string | URLSearchParams, hxVals?: Record<string, string | number | boolean>) {
  const params = new URLSearchParams(search);
  const get = (key: string) => params.get(key) ?? hxVals?.[key];

  return {
    getBoolean: (key: string) => Boolean(get(key)),
    getNumber: (key: string) => Number(get(key)),
    getString: (key: string) => String(get(key)),
  };
}