export type Callback = (pathname: string, query: URLSearchParams) => Promise<string | null | undefined> | string | null | undefined;
export function hxGet(callback: Callback): void;