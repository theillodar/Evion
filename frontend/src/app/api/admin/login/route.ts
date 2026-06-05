import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionToken,
  getAdminPassword,
} from "@/lib/server-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  password?: string;
};

export async function POST(request: Request): Promise<Response> {
  let payload: LoginBody;

  try {
    payload = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const input = payload.password ?? "";
  const expected = getAdminPassword();

  const inputBuf = Buffer.from(input);
  const expectedBuf = Buffer.from(expected);

  const valid = inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf);

  if (!valid) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: buildAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
