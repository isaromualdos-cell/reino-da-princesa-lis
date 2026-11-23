import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const base = "https://b082b853-746d-4e81-87ac-a1bbfa1caaca.sandbox.floot.app";
const images: Record<string,string> = {
  "1": "7dc84888-afba-4868-9c33-0e06924815f8-lis-moldura-1.png",
  "2": "824d5157-56fc-45db-8fc9-64d54a2eb554-lis-moldura-2.png",
  "3": "d46db8a2-75af-4caf-80ec-815fb10cf719-lis-moldura-3.png",
  "4": "962b02d0-59a5-4fb8-b887-b49a17784010-lis-moldura-4.png",
  "5": "1cad95fd-8f92-4c5a-a165-1dbc94f090d3-lis-moldura-5.png",
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
