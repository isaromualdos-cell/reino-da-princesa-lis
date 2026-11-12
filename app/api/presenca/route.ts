import { parseRsvp, saveRsvp, validRsvpId } from "../../rsvp";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }
  const id = request.headers.get("x-rsvp-id") ?? "";
  if (!validRsvpId.test(id)) return new Response(null, { status: 400 });
  if (Number(request.headers.get("content-length")) > 12_000) return new Response(null, { status: 413 });
  const body = await request.text();
  if (body.length > 12_000) return new Response(null, { status: 413 });

  try {
    const response = parseRsvp(JSON.parse(body));
    if (!response) return new Response(null, { status: 400 });
    try {
      await saveRsvp(id, response);
    } catch {
      return new Response(null, { status: 503 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
