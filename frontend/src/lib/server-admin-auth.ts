import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "evion_admin_session";

const DEFAULT_PASSWORD = "evionadmin";
const DEFAULT_EMAIL = "admin@evionshop.pl";
const DEFAULT_SECRET = "change-this-admin-auth-secret";

function normalizeSecret(secret: string): string {
  return secret.trim() || DEFAULT_SECRET;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PANEL_PASSWORD ?? DEFAULT_PASSWORD;
}

export function getAdminEmail(): string {
  return process.env.ADMIN_PANEL_EMAIL ?? DEFAULT_EMAIL;
}

function getSigningSecret(): string {
  return normalizeSecret(process.env.ADMIN_AUTH_SECRET ?? DEFAULT_SECRET);
}

export function buildAdminSessionToken(): string {
  return crypto.createHmac("sha256", getSigningSecret()).update("evion-admin-session").digest("hex");
}

function parseCookieHeader(headerValue: string | null): Record<string, string> {
  if (!headerValue) return {};

  return headerValue
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, item) => {
      const idx = item.indexOf("=");
      if (idx === -1) return acc;
      const key = item.slice(0, idx).trim();
      const value = item.slice(idx + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

export function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookieHeader(cookieHeader);
  const actual = cookies[ADMIN_SESSION_COOKIE];
  if (!actual) return false;

  const expected = buildAdminSessionToken();
  const actualBuf = Buffer.from(actual);
  const expectedBuf = Buffer.from(expected);

  if (actualBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(actualBuf, expectedBuf);
}
