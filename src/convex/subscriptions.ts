import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const COMMISSION_PER_CLAIM_ZAR = 5;
const PREMIUM_PRICE_ZAR = 99;

export const getSubscription = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();
    return sub ?? null;
  },
});

export const getInvoices = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .order("desc")
      .collect();
  },
});

export const subscribePremium = mutation({
  args: {
    user_id: v.id("users"),
    payu_customer_id: v.string(),
    payu_recurring_token: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user || user.role !== "brand") {
      throw new Error("Only brands can subscribe to premium.");
    }

    // Cancel any existing subscription
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();

    if (existing && existing.status === "active") {
      await ctx.db.patch(existing._id, { status: "cancelled", cancelled_at: Date.now() });
    }

    const now = Date.now();
    const periodEnd = now + 30 * 24 * 60 * 60 * 1000; // 30 days

    const subId = await ctx.db.insert("subscriptions", {
      user_id: args.user_id,
      tier: "premium",
      status: "active",
      provider: "payu",
      provider_customer_id: args.payu_customer_id,
      provider_subscription_id: args.payu_recurring_token,
      current_period_start: now,
      current_period_end: periodEnd,
      createdAt: now,
    });

    // Record invoice
    await ctx.db.insert("invoices", {
      user_id: args.user_id,
      subscription_id: subId,
      amount_zar: PREMIUM_PRICE_ZAR,
      status: "paid",
      provider: "payu",
      description: "Proe Premium — Monthly",
      paid_at: now,
      createdAt: now,
    });

    // Initialize brand balance if not exists
    const existingBalance = await ctx.db
      .query("brand_balances")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.user_id))
      .first();

    if (!existingBalance) {
      await ctx.db.insert("brand_balances", {
        brand_id: args.user_id,
        balance_zar: 0,
        pending_commission_zar: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { subscriptionId: subId, success: true };
  },
});

export const cancelSubscription = mutation({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();

    if (!sub || sub.status !== "active") {
      throw new Error("No active subscription found.");
    }

    await ctx.db.patch(sub._id, {
      status: "cancelled",
      cancelled_at: Date.now(),
    });

    return { success: true, message: "Subscription cancelled. Access continues until end of billing period." };
  },
});

export const processPayuWebhook = mutation({
  args: {
    event_type: v.string(),
    payu_subscription_id: v.optional(v.string()),
    payu_customer_id: v.optional(v.string()),
    amount: v.optional(v.number()),
    status: v.optional(v.string()),
    invoice_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Handle subscription renewal
    if (args.event_type === "subscription.renewed" && args.payu_subscription_id) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_provider_sub", (q) => q.eq("provider_subscription_id", args.payu_subscription_id!))
        .first();

      if (sub) {
        const now = Date.now();
        const periodEnd = now + 30 * 24 * 60 * 60 * 1000;
        await ctx.db.patch(sub._id, {
          status: "active",
          current_period_start: now,
          current_period_end: periodEnd,
        });

        await ctx.db.insert("invoices", {
          user_id: sub.user_id,
          subscription_id: sub._id,
          amount_zar: PREMIUM_PRICE_ZAR,
          status: "paid",
          provider: "payu",
          provider_invoice_id: args.invoice_id,
          description: "Proe Premium — Monthly (Renewal)",
          paid_at: now,
          createdAt: now,
        });
      }
    }

    // Handle failed payment
    if (args.event_type === "subscription.payment_failed" && args.payu_subscription_id) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_provider_sub", (q) => q.eq("provider_subscription_id", args.payu_subscription_id!))
        .first();

      if (sub) {
        await ctx.db.patch(sub._id, { status: "past_due" });
      }
    }

    // Handle subscription cancelled
    if (args.event_type === "subscription.cancelled" && args.payu_subscription_id) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_provider_sub", (q) => q.eq("provider_subscription_id", args.payu_subscription_id!))
        .first();

      if (sub) {
        await ctx.db.patch(sub._id, { status: "cancelled", cancelled_at: Date.now() });
      }
    }

    return { received: true };
  },
});

export const getCommissionPerClaim = query({
  args: {},
  handler: async () => {
    return COMMISSION_PER_CLAIM_ZAR;
  },
});
