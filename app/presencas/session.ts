import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const cookieName = "lis_admin";
export const sessionSeconds = 12 * 60 * 60;

function equal(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

function sign(expiry: string, secret: string) {
  return createHmac("sha256", secret).update("lis-rsvp:" + expiry).digest("base64url");
}

export function startSession(password: string) {
  const secret = process.env.LIS_ADMIN_PASSWORD;
  if (!secret || !equal(secret, password)) return null;
  const expiry = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  return expiry + "." + sign(expiry, secret);
}

export function validSession(token: string | undefined) {
  const secret = process.env.LIS_ADMIN_PASSWORD;
  if (!secret || !token) return false;
  const [expiry, signature, extra] = token.split(".");
  return !extra && Boolean(signature) && /^\d{10}$/.test(expiry) &&
    Number(expiry) > Math.floor(Date.now() / 1000) && equal(signature, sign(expiry, secret));
}
