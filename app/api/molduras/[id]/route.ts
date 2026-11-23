import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const base = "https://b082b853-746d-4e81-87ac-a1bbfa1caaca.sandbox.floot.app";
const images: Record<string,string> = {
  "1": "00839ea4-0fd1-48b9-93c9-0f0bda8f7996-lis-moldura-encaixe-1.png",
  "2": "5d0751b0-4f62-4eea-b24a-1dc3cbf05040-lis-moldura-encaixe-2.png",
  "3": "2a244ca2-574a-4bb8-b1a9-31f44fd35141-lis-moldura-encaixe-3.png",
  "4": "00036131-e272-4aae-91c2-8c6371a442ff-lis-moldura-encaixe-4.png",
  "5": "79666c29-6e1d-4381-8400-ff71f33b335e-lis-moldura-encaixe-5.png",
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
