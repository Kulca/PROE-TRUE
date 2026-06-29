import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY ?? "";
const PAYU_MERCHANT_SECRET = process.env.PAYU_MERCHANT_SECRET ?? "";

// PayU sends UTF-8 encoded form data
function verifyPayUSignature(
  params: Record<string, string>,
  signature: string,
): boolean {
  // PayU signature format: SHA-256 of certain fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relevantFields = ["merchantReference", "transactionType", "amount", "currency", "resultCode"];
  const data = relevantFields
    .map((f) => params[f] ?? "")
    .join("");

  const expectedSig = crypto
    .createHmac("sha256", PAYU_MERCHANT_SECRET)
    .update(data)
    .digest("base64");

  return signature === expectedSig;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    let payload: Record<string, string>;

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    }

    const sigHeader = req.headers.get("x-payu-signature") ?? "";

    if (PAYU_MERCHANT_SECRET && sigHeader && !verifyPayUSignature(payload, sigHeader)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const eventType = payload.transactionType ?? payload.eventType ?? "unknown";
    const payuSubscriptionId = payload.recurringToken ?? payload.subscriptionReference ?? undefined;
    const payuCustomerId = payload.customerId ?? payload.payuCustomerId ?? undefined;
    const amount = payload.amount ? parseFloat(payload.amount) : undefined;
    const status = payload.resultCode ?? payload.status ?? undefined;
    const invoiceId = payload.merchantReference ?? undefined;

    // Forward to Convex via internal API call
    // In production, use Convex HTTP actions or call the processPayuWebhook mutation directly
    // Here we simulate by logging — connect to Convex action in production
    console.log("[PayU Webhook]", {
      eventType,
      payuSubscriptionId,
      amount,
      status,
      invoiceId,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[PayU Webhook Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
