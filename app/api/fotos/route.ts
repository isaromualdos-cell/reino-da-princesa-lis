import { head, put } from "@vercel/blob";
import sharp from "sharp";

const maxBytes = 4_000_000;
const photoIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }

  const photoId = request.headers.get("x-photo-id") ?? "";
  if (!photoIdPattern.test(photoId) || request.headers.get("content-type") !== "image/jpeg") {
    return new Response(null, { status: 400 });
  }

  const length = Number(request.headers.get("content-length"));
  if (length > maxBytes) return new Response(null, { status: 413 });
  const input = await request.arrayBuffer();
  if (input.byteLength > maxBytes) return new Response(null, { status: 413 });

  let photo: Buffer;
  try {
    const image = sharp(Buffer.from(input), { limitInputPixels: 6_000_000 });
    const { format, width, height } = await image.metadata();
    if (format !== "jpeg" || !width || !height || width * 4 !== height * 3) {
      return new Response(null, { status: 415 });
    }
    photo = await image.jpeg({ quality: 92 }).toBuffer();
  } catch {
    return new Response(null, { status: 415 });
  }

  const pathname = `aniversario-lis/${photoId}.jpg`;
  try {
    await put(pathname, photo, {
      access: "private",
      contentType: "image/jpeg",
      addRandomSuffix: false,
      allowOverwrite: false,
    });
  } catch {
    // A retry after a lost response should succeed without saving a second copy.
    try {
      await head(pathname);
    } catch {
      return new Response(null, { status: 503 });
    }
  }

  return new Response(null, { status: 204 });
}
