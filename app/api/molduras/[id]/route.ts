import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const base = "https://b082b853-746d-4e81-87ac-a1bbfa1caaca.sandbox.floot.app";
const images: Record<string,string> = {
  "1": "2f66bbb8-def2-451e-b1d6-e4e7090d946e-lis-moldura-ajustada-1.png",
  "2": "c253dda3-de0c-4b6c-8271-2b98acbbaa65-lis-moldura-ajustada-2.png",
  "3": "6fcf20d2-8df0-42b3-aceb-f193fea65efc-lis-moldura-ajustada-3.png",
  "4": "32260166-b022-4f7d-ab7f-0cd2f7b737df-lis-moldura-ajustada-4.png",
  "5": "142467f4-8229-4b1e-a248-090f88ae3b2a-lis-moldura-ajustada-5.png",
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
