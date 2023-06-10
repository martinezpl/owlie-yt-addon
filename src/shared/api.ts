export async function callAPI(
  path: string,
  body?: BodyInit,
  method: string = "POST"
): Promise<Response> {
  let params: RequestInit = {
    mode: "cors",
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
  };
  if (body) {
    params.body = body;
  }
  params.method = method;
  return fetch("__API_BASE__" + path, params);
}
