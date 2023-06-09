"__HASH_FUNCTION__"; // will get replaced at build time

export async function callAPI(
  path: string,
  id?: string,
  body?: BodyInit,
  method: string = "POST"
): Promise<Response> {
  let params: RequestInit = {
    mode: "cors",
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: { "x-owlie-code": id || "", "x-token": "__GET_HASH__" }, // will get replaced at build time
  };
  if (body) {
    params.body = body;
  }
  params.method = method;
  return fetch("__API_BASE__" + path, params);
}
