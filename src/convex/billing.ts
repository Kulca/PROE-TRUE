import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const COMMISSION_PER_CLAIM_ZAR = 5;
const MIN_PAYOUT_ZAR = 100;

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

export const chargeCommission = mutation({
  args: {
    brand_id: v.id("users"),
    claim_id: v.id("claims"),
    campaign_id: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if brand is on premium — skip commission
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user_id", args.brand_id))
      .first();

    if (sub && sub.tier === "premium" && sub.status === "active") {
      return { charged: false, reason: "premium_tier" };
    }

    // Get or create brand balance
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

    // Deduct commission from balance
    const newBalance = Math.max(0, balance!.balance_zar - COMMISSION_PER_CLAIM_ZAR);
    await ctx.db.patch(balance!._id, {
      balance_zar: newBalance,
      updatedAt: now,
    });

    // Record transaction
    await ctx.db.insert("transactions", {
      brand_id: args.brand_id,
      type: "commission_charged",
      amount_zar: -COMMISSION_PER_CLAIM_ZAR,
      claim_id: args.claim_id,
      description: `Commission charged for claim`,
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

    // Deduct from balance
    await ctx.db.patch(balance._id, {
      balance_zar: balance.balance_zar - args.amount_zar,
      updatedAt: now,
    });

    // Create payout record
    const payoutId = await ctx.db.insert("payouts", {
      brand_id: args.brand_id,
      amount_zar: args.amount_zar,
      status: "pending",
      provider: "payu",
      bank_account: args.bank_account,
      requested_at: now,
    });

    // Record transaction
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
