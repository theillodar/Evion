import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return NextResponse.json({ authed: isAdminRequest(request) });
}
