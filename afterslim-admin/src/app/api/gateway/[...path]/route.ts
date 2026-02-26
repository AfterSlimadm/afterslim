import { NextResponse } from "next/server";

const VPS_GATEWAY_URL = process.env.VPS_GATEWAY_URL ?? "http://217.216.89.234:18832";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "";

/**
 * OpenClaw Gateway Proxy
 * Forwards requests to the VPS gateway while keeping credentials server-side.
 * Same pattern used in the Approved Ideas project.
 */
async function proxyToGateway(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const url = `${VPS_GATEWAY_URL}/${targetPath}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (GATEWAY_TOKEN) {
    headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
  }

  try {
    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined;

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gateway unreachable", details: String(error) },
      { status: 502 }
    );
  }
}

export const GET = proxyToGateway;
export const POST = proxyToGateway;
export const PUT = proxyToGateway;
export const PATCH = proxyToGateway;
export const DELETE = proxyToGateway;
