import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const base = "https://b082b853-746d-4e81-87ac-a1bbfa1caaca.sandbox.floot.app";
const images: Record<string,string> = {
  "1": "5161df54-81e8-4504-90ab-3276f4b954c6-lis-nova-moldura-1.png",
  "2": "a7f495b1-095e-4493-bd6c-7e803780f32e-lis-nova-moldura-2.png",
  "3": "afaacc44-be49-443b-86f0-23ca950717a8-lis-nova-moldura-3.png",
  "4": "b0e638e0-4cc0-46ab-ba4d-c7a585acf400-lis-nova-moldura-4.png",
  "5": "ce721c71-de24-4d21-aed7-6db74c40be6f-lis-nova-moldura-5.png",
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filename = images[id];
  if (!filename) return new NextResponse("Moldura não encontrada", { status: 404 });
  try {
    const response = await fetch(base + "/_cdn/static/" + filename, { next: { revalidate: 86400 } });
    if (!response.ok) return new NextResponse("Moldura indisponível", { status: 502 });
    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("Moldura temporariamente indisponível", { status: 502 });
  }
}
