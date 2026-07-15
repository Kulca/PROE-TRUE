import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";

function isValidSignature(rawBody: string, signature: string) {
  if (!PAYSTACK_SECRET_KEY) {
    return false;
  }

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-paystack-signature") ?? "";
    const rawBody = await req.text();

    if (!isValidSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event as string;
    const data = payload.data ?? {};

    if (!["subscription.create", "subscription.disable", "subscription.notified", "charge.success"].includes(event)) {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const client = new ConvexHttpClient(convexUrl);
      await client.mutation("subscriptions:processPaystackWebhook" as any, {
        event_type: event,
        data,
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[Paystack Webhook Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
