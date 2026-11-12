import { NextResponse } from "next/server";
import { cookieName, sessionSeconds, startSession } from "../session";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }
  if (Number(request.headers.get("content-length")) > 2048) return new Response(null, { status: 413 });

  const form = await request.formData().catch(() => null);
  const password = form?.get("password");
  const logout = form?.get("logout") === "yes";
  const token = typeof password === "string" ? startSession(password) : null;
  const response = new NextResponse(null, {
    status: 303,
    headers: { Location: logout || token ? "/presencas" : "/presencas?erro=1", "Cache-Control": "no-store" },
  });
  if (logout || token) {
    response.cookies.set(cookieName, logout ? "" : token ?? "", {
      path: "/presencas",
      httpOnly: true,
      secure: new URL(request.url).protocol === "https:",
      sameSite: "strict",
      maxAge: logout ? 0 : sessionSeconds,
    });
  }
  return response;
}
