import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionToken,
  getAdminEmail,
  getAdminPassword,
} from "@/lib/server-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request): Promise<Response> {
  let payload: LoginBody;

  try {
    payload = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const inputEmail = payload.email ?? "";
  const inputPassword = payload.password ?? "";
  const expectedEmail = getAdminEmail();
  const expectedPassword = getAdminPassword();

  const emailBuf = Buffer.from(inputEmail);
  const expectedEmailBuf = Buffer.from(expectedEmail);
  const passwordBuf = Buffer.from(inputPassword);
  const expectedPasswordBuf = Buffer.from(expectedPassword);

  const emailValid =
    emailBuf.length === expectedEmailBuf.length &&
    crypto.timingSafeEqual(emailBuf, expectedEmailBuf);

  const passwordValid =
    passwordBuf.length === expectedPasswordBuf.length &&
    crypto.timingSafeEqual(passwordBuf, expectedPasswordBuf);

  if (!emailValid || !passwordValid) {
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
