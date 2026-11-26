import { NextRequest, NextResponse } from "next/server";
import { frameAssetUrl } from "../../../frame-assets";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = frameAssetUrl(id);
  if (!asset) return new NextResponse("Moldura não encontrada", { status: 404 });
  return NextResponse.redirect(new URL(asset, request.url), {
    status: 307,
    headers: { "Cache-Control": "no-store" },
  });
}