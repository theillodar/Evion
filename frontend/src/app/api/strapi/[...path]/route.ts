export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { isAdminRequest } from "@/lib/server-admin-auth";

type Ctx = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxy(request: Request, ctx: Ctx): Promise<Response> {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && !isAdminRequest(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const params = await ctx.params;
  const rawBase = (process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "").trim();
  const base = rawBase.replace(/\/+$/, "").replace(/\/api$/, "");
  const token = (process.env.STRAPI_API_TOKEN ?? "").trim();
  const requestUrl = new URL(request.url);
  const apiPath = (params.path ?? []).join("/");

  if (!base) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: STRAPI_URL is not set" }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  if (method !== "GET" && method !== "HEAD" && !token) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: STRAPI_API_TOKEN is not set for write operations" }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const target = `${base}/api/${apiPath}${requestUrl.search}`;

  const contentType = request.headers.get("content-type") || "";
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (contentType && !contentType.includes("multipart/form-data")) {
    headers.set("Content-Type", contentType);
  }

  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "DELETE") {
    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      const text = await request.text();
      body = text || undefined;
    }
  }

  let response: Response;
  try {
    response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown proxy error";
    return new Response(
      JSON.stringify({ error: `Failed to reach Strapi: ${message}` }),
      {
        status: 502,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const outgoingHeaders = new Headers();
  const responseType = response.headers.get("content-type");
  if (responseType) {
    outgoingHeaders.set("content-type", responseType);
  }

  if (response.status === 204 || response.status === 205) {
    return new Response(null, {
      status: response.status,
      headers: outgoingHeaders,
    });
  }

  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers: outgoingHeaders,
  });
}

export async function GET(request: Request, ctx: Ctx): Promise<Response> {
  return proxy(request, ctx);
}

export async function POST(request: Request, ctx: Ctx): Promise<Response> {
  return proxy(request, ctx);
}

export async function PUT(request: Request, ctx: Ctx): Promise<Response> {
  return proxy(request, ctx);
}

export async function DELETE(request: Request, ctx: Ctx): Promise<Response> {
  return proxy(request, ctx);
}
