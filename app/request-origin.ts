export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const { origin: requestOrigin, protocol } = new URL(request.url);
  return origin !== null && (origin === requestOrigin || (host !== null && origin === protocol + "//" + host));
}
