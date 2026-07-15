import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get("proe_session")?.value;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const deployKey = process.env.CONVEX_DEPLOY_KEY;

  if (sessionToken && convexUrl) {
    await fetch(`${convexUrl}/api/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(deployKey ? { Authorization: `Bearer ${deployKey}` } : {}),
      },
      body: JSON.stringify({
        path: "auth:logout",
        args: { session_token: sessionToken },
      }),
    }).catch(() => null);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("proe_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
