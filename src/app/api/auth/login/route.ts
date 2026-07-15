import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const deployKey = process.env.CONVEX_DEPLOY_KEY;

    if (!convexUrl) {
      return NextResponse.json({ error: "Convex not configured." }, { status: 500 });
    }

    const res = await fetch(`${convexUrl}/api/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(deployKey ? { Authorization: `Bearer ${deployKey}` } : {}),
      },
      body: JSON.stringify({
        path: "auth:login",
        args: { email, password },
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return NextResponse.json({ error: data.error?.message ?? "Invalid credentials." }, { status: 401 });
    }

    const result = data.value || data;

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set("proe_session", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 500 });
  }
}
