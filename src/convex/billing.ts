import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";

const COMMISSION_PER_CLAIM_ZAR = 5;
const MIN_PAYOUT_ZAR = 100;

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getPaystackHeaders() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  };
}

export const getBalance = query({
  args: { brand_id: v.id("users") },
  handler: async (ctx, args) => {
    const balance = await ctx.db
      .query("brand_balances")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .first();

    return balance ?? { brand_id: args.brand_id, balance_zar: 0, pending_commission_zar: 0 };
  },
});

export const getTransactions = query({
  args: { brand_id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .order("desc")
      .take(50);
  },
});

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

export const createSubscription = mutation({
  args: {
    user_id: v.id("users"),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user) {
      throw new Error("User not found.");
    }

    const planCode = args.plan ?? process.env.PAYSTACK_PREMIUM_PLAN_CODE ?? "PROE_PREMIUM";
    const currency = process.env.PAYSTACK_CURRENCY ?? "ZAR";

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/subscription`,
      {
        customer: user.email,
        plan: planCode,
        currency,
      },
      { headers: getPaystackHeaders() },
    );

    const data = response.data?.data ?? {};
    const now = Date.now();

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();

    if (existing && existing.status === "active") {
      await ctx.db.patch(existing._id, {
        status: "cancelled",
        cancelled_at: now,
      });
    }

    const subscriptionId = await ctx.db.insert("subscriptions", {
      user_id: args.user_id,
      tier: "premium",
      status: "trialing",
      provider: "paystack",
      provider_subscription_id: data.subscription_code,
      provider_customer_id: data.email_token ?? data.customer_code ?? user.email,
      current_period_start: now,
      current_period_end: now + 30 * 24 * 60 * 60 * 1000,
      createdAt: now,
    });

    return {
      success: true,
      subscriptionId,
      authorization_url: data.authorization_url ?? null,
      subscription_code: data.subscription_code ?? null,
    };
  },
});

export const cancelSubscription = mutation({
  args: {
    subscription_id: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.subscription_id);
    if (!sub) {
      throw new Error("Subscription not found.");
    }

    if (sub.provider_subscription_id && sub.provider_customer_id) {
      await axios.post(
        `${PAYSTACK_BASE_URL}/subscription/disable`,
        {
          code: sub.provider_subscription_id,
          token: sub.provider_customer_id,
        },
        { headers: getPaystackHeaders() },
      );
    }

    await ctx.db.patch(sub._id, {
      status: "cancelled",
      cancelled_at: Date.now(),
    });

    return { success: true };
  },
});

export const chargeCommission = mutation({
  args: {
    brand_id: v.id("users"),
    claim_id: v.id("claims"),
    campaign_id: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.brand_id))
      .first();

    if (sub && sub.tier === "premium" && sub.status === "active") {
      return { charged: false, reason: "premium_tier" };
    }

    let balance = await ctx.db
      .query("brand_balances")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .first();

    if (!balance) {
      const id = await ctx.db.insert("brand_balances", {
        brand_id: args.brand_id,
        balance_zar: 0,
        pending_commission_zar: 0,
        createdAt: now,
        updatedAt: now,
      });
      balance = await ctx.db.get(id);
    }

    const newBalance = Math.max(0, balance!.balance_zar - COMMISSION_PER_CLAIM_ZAR);
    await ctx.db.patch(balance!._id, {
      balance_zar: newBalance,
      updatedAt: now,
    });

    await ctx.db.insert("transactions", {
      brand_id: args.brand_id,
      type: "commission_charged",
      amount_zar: -COMMISSION_PER_CLAIM_ZAR,
      claim_id: args.claim_id,
      description: "Commission charged for claim",
      createdAt: now,
    });

    return { charged: true, amount: COMMISSION_PER_CLAIM_ZAR, new_balance: newBalance };
  },
});

export const requestPayout = mutation({
  args: {
    brand_id: v.id("users"),
    amount_zar: v.number(),
    bank_account: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.amount_zar < MIN_PAYOUT_ZAR) {
      throw new Error(`Minimum payout is R${MIN_PAYOUT_ZAR}.`);
    }

    const balance = await ctx.db
      .query("brand_balances")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .first();

    if (!balance || balance.balance_zar < args.amount_zar) {
      throw new Error("Insufficient balance for payout.");
    }

    const now = Date.now();

    await ctx.db.patch(balance._id, {
      balance_zar: balance.balance_zar - args.amount_zar,
      updatedAt: now,
    });

    const payoutId = await ctx.db.insert("payouts", {
      brand_id: args.brand_id,
      amount_zar: args.amount_zar,
      status: "pending",
      provider: "paystack",
      bank_account: args.bank_account,
      requested_at: now,
    });

    await ctx.db.insert("transactions", {
      brand_id: args.brand_id,
      type: "payout",
      amount_zar: -args.amount_zar,
      description: `Payout requested — R${args.amount_zar}`,
      createdAt: now,
    });

    return { payoutId, success: true };
  },
});

export const addFunds = mutation({
  args: {
    brand_id: v.id("users"),
    amount_zar: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let balance = await ctx.db
      .query("brand_balances")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .first();

    if (!balance) {
      const id = await ctx.db.insert("brand_balances", {
        brand_id: args.brand_id,
        balance_zar: args.amount_zar,
        pending_commission_zar: 0,
        createdAt: now,
        updatedAt: now,
      });
      balance = await ctx.db.get(id);
    } else {
      await ctx.db.patch(balance._id, {
        balance_zar: balance.balance_zar + args.amount_zar,
        updatedAt: now,
      });
    }

    await ctx.db.insert("transactions", {
      brand_id: args.brand_id,
      type: "topup",
      amount_zar: args.amount_zar,
      description: `Funds added — R${args.amount_zar}`,
      createdAt: now,
    });

    return { success: true, new_balance: balance!.balance_zar + args.amount_zar };
  },
});

export const getPayoutHistory = query({
  args: { brand_id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payouts")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .order("desc")
      .take(20);
  },
});

export const getBrandBillingSummary = query({
  args: { brand_id: v.id("users") },
  handler: async (ctx, args) => {
    const [balance, sub, transactions, recentInvoices] = await Promise.all([
      ctx.db.query("brand_balances").withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id)).first(),
      ctx.db.query("subscriptions").withIndex("by_user", (q) => q.eq("user_id", args.brand_id)).first(),
      ctx.db.query("transactions").withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id)).order("desc").take(10),
      ctx.db.query("invoices").withIndex("by_user", (q) => q.eq("user_id", args.brand_id)).order("desc").take(5),
    ]);

    return {
      balance: balance ?? { brand_id: args.brand_id, balance_zar: 0, pending_commission_zar: 0 },
      subscription: sub ?? null,
      recentTransactions: transactions,
      recentInvoices,
      commissionPerClaim: COMMISSION_PER_CLAIM_ZAR,
      premiumPrice: 99,
      minPayout: MIN_PAYOUT_ZAR,
    };
  },
});
