import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const COMMISSION_PER_CLAIM_ZAR = 5;
const PREMIUM_PRICE_ZAR = 99;

const normalizeEmail = (email?: string) => email?.trim().toLowerCase();

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
    paystack_customer_id: v.string(),
    paystack_subscription_code: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user || user.role !== "brand") {
      throw new Error("Only brands can subscribe to premium.");
    }

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();

    if (existing && existing.status === "active") {
      await ctx.db.patch(existing._id, { status: "cancelled", cancelled_at: Date.now() });
    }

    const now = Date.now();
    const periodEnd = now + 30 * 24 * 60 * 60 * 1000;

    const subId = await ctx.db.insert("subscriptions", {
      user_id: args.user_id,
      tier: "premium",
      status: "active",
      provider: "paystack",
      provider_customer_id: args.paystack_customer_id,
      provider_subscription_id: args.paystack_subscription_code,
      current_period_start: now,
      current_period_end: periodEnd,
      createdAt: now,
    });

    await ctx.db.insert("invoices", {
      user_id: args.user_id,
      subscription_id: subId,
      amount_zar: PREMIUM_PRICE_ZAR,
      status: "paid",
      provider: "paystack",
      description: "Proe Premium — Monthly",
      paid_at: now,
      createdAt: now,
    });

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

export const processPaystackWebhook = mutation({
  args: {
    event_type: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const payload = (args.data ?? {}) as Record<string, any>;
    const now = Date.now();

    if (args.event_type === "subscription.notified") {
      return { received: true, ignored: true };
    }

    if (args.event_type === "subscription.create") {
      const subscriptionCode = payload.subscription_code as string | undefined;
      const emailToken = payload.email_token as string | undefined;
      const customerEmail = normalizeEmail(payload.customer?.email ?? payload.email);

      if (subscriptionCode) {
        const existing = await ctx.db
          .query("subscriptions")
          .withIndex("by_provider_sub", (q) => q.eq("provider_subscription_id", subscriptionCode))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, {
            status: "active",
            provider_customer_id: emailToken ?? existing.provider_customer_id,
            current_period_start: now,
            current_period_end: now + 30 * 24 * 60 * 60 * 1000,
          });
        } else if (customerEmail) {
          const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", customerEmail))
            .unique();

          if (user) {
            await ctx.db.insert("subscriptions", {
              user_id: user._id,
              tier: "premium",
              status: "active",
              provider: "paystack",
              provider_subscription_id: subscriptionCode,
              provider_customer_id: emailToken,
              current_period_start: now,
              current_period_end: now + 30 * 24 * 60 * 60 * 1000,
              createdAt: now,
            });
          }
        }
      }
    }

    if (args.event_type === "subscription.disable") {
      const subscriptionCode = payload.subscription_code as string | undefined;
      if (subscriptionCode) {
        const sub = await ctx.db
          .query("subscriptions")
          .withIndex("by_provider_sub", (q) => q.eq("provider_subscription_id", subscriptionCode))
          .first();

        if (sub) {
          await ctx.db.patch(sub._id, { status: "cancelled", cancelled_at: now });
        }
      }
    }

    if (args.event_type === "charge.success") {
      const customerEmail = normalizeEmail(payload.customer?.email ?? payload.email);
      const amountInCents = typeof payload.amount === "number" ? payload.amount : 0;
      const amountZar = amountInCents > 0 ? amountInCents / 100 : PREMIUM_PRICE_ZAR;

      if (customerEmail) {
        const user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", customerEmail))
          .unique();

        if (user) {
          const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("user_id", user._id))
            .first();

          await ctx.db.insert("invoices", {
            user_id: user._id,
            subscription_id: sub?._id,
            amount_zar: amountZar,
            status: "paid",
            provider: "paystack",
            provider_invoice_id: payload.reference as string | undefined,
            description: "Proe Premium — Monthly",
            paid_at: now,
            createdAt: now,
          });
        }
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
