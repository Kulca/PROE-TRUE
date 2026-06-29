import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const shippingStatus = v.union(
  v.literal("pending"),
  v.literal("in_transit"),
  v.literal("ready_for_pickup"),
  v.literal("collected"),
);

const randomDigits = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

const generatePinCode = () => randomDigits(6);
const generateTrackingNumber = () => `PROE-${Date.now().toString().slice(-8)}-${randomDigits(4)}`;
const generateWaybillNumber = () => `WB-${Date.now().toString().slice(-7)}-${randomDigits(3)}`;

export const create = mutation({
  args: {
    user_id: v.id("users"),
    campaign_id: v.id("campaigns"),
    selected_locker_id: v.optional(v.string()),
    agree_to_survey_lock: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.agree_to_survey_lock) {
      throw new Error("You must agree to complete the Proe survey to claim a sample.");
    }

    const user = await ctx.db.get(args.user_id);
    if (!user || user.role !== "consumer") {
      throw new Error("Only consumers can claim freebies.");
    }

    const campaign = await ctx.db.get(args.campaign_id);
    if (!campaign || !campaign.is_active) {
      throw new Error("Campaign is not active.");
    }

    if (campaign.inventory_count <= 0) {
      throw new Error("This campaign is out of stock.");
    }

    const allUserClaims = await ctx.db
      .query("claims")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    const blockingClaims = [];
    for (const claim of allUserClaims) {
      if (claim.shipping_status === "ready_for_pickup" || claim.shipping_status === "collected") {
        const submittedSurvey = await ctx.db
          .query("surveys")
          .withIndex("by_claim", (q) => q.eq("claim_id", claim._id))
          .unique();

        if (!submittedSurvey) {
          blockingClaims.push(claim._id);
        }
      }
    }

    if (blockingClaims.length > 0) {
      throw new Error("Please submit pending survey responses before claiming another freebie.");
    }

    const duplicateClaim = allUserClaims.find((claim) => claim.campaign_id === args.campaign_id);
    if (duplicateClaim) {
      throw new Error("You already claimed this campaign.");
    }

    const claimId = await ctx.db.insert("claims", {
      user_id: args.user_id,
      campaign_id: args.campaign_id,
      pudo_pin_code: generatePinCode(),
      shipping_status: "pending",
      pudo_tracking_number: generateTrackingNumber(),
      selected_locker_id: args.selected_locker_id,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.campaign_id, {
      inventory_count: campaign.inventory_count - 1,
      is_active: campaign.inventory_count - 1 > 0,
    });

    return { claimId, success: true };
  },
});

export const listByUser = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .order("desc")
      .collect();

    return await Promise.all(
      claims.map(async (claim) => {
        const campaign = await ctx.db.get(claim.campaign_id);
        const survey = await ctx.db
          .query("surveys")
          .withIndex("by_claim", (q) => q.eq("claim_id", claim._id))
          .unique();

        return {
          ...claim,
          campaign,
          survey_submitted: Boolean(survey),
        };
      }),
    );
  },
});

export const listByCampaign = query({
  args: {
    campaign_id: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("claims")
      .withIndex("by_campaign", (q) => q.eq("campaign_id", args.campaign_id))
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    claim_id: v.id("claims"),
    shipping_status: shippingStatus,
    pudo_tracking_number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const claim = await ctx.db.get(args.claim_id);
    if (!claim) {
      throw new Error("Claim not found.");
    }

    const campaign = await ctx.db.get(claim.campaign_id);

    await ctx.db.patch(args.claim_id, {
      shipping_status: args.shipping_status,
      pudo_tracking_number: args.pudo_tracking_number ?? claim.pudo_tracking_number,
    });

    // Charge commission when item is collected (on free tier)
    if (args.shipping_status === "collected" && campaign) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("user_id", campaign.brand_id))
        .first();

      const isPremium = sub && sub.tier === "premium" && sub.status === "active";

      if (!isPremium) {
        const now = Date.now();
        const COMMISSION = 5;

        let balance = await ctx.db
          .query("brand_balances")
          .withIndex("by_brand", (q) => q.eq("brand_id", campaign.brand_id))
          .first();

        if (!balance) {
          const id = await ctx.db.insert("brand_balances", {
            brand_id: campaign.brand_id,
            balance_zar: 0,
            pending_commission_zar: 0,
            createdAt: now,
            updatedAt: now,
          });
          balance = await ctx.db.get(id);
        }

        const newBalance = Math.max(0, balance!.balance_zar - COMMISSION);
        await ctx.db.patch(balance!._id, { balance_zar: newBalance, updatedAt: now });

        await ctx.db.insert("transactions", {
          brand_id: campaign.brand_id,
          type: "commission_charged",
          amount_zar: -COMMISSION,
          claim_id: args.claim_id,
          description: `Commission charged for collected claim`,
          createdAt: now,
        });
      }
    }

    return { success: true };
  },
});

export const generateWaybill = mutation({
  args: {
    claim_id: v.id("claims"),
    mode: v.union(v.literal("bulk"), v.literal("individual")),
    package_size: v.union(v.literal("XS"), v.literal("S"), v.literal("M"), v.literal("L"), v.literal("XL")),
    quantity: v.optional(v.number()),
    destination_locker_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const claim = await ctx.db.get(args.claim_id);
    if (!claim) {
      throw new Error("Claim not found.");
    }

    const trackingNumber = claim.pudo_tracking_number ?? generateTrackingNumber();
    const waybillNumber = generateWaybillNumber();

    await ctx.db.patch(args.claim_id, {
      pudo_tracking_number: trackingNumber,
    });

    return {
      success: true,
      mode: args.mode,
      waybillNumber,
      trackingNumber,
      packageSize: args.package_size,
      quantity: args.quantity ?? 1,
      destinationLockerId: args.destination_locker_id ?? claim.selected_locker_id ?? null,
      printableLabel: {
        format: "4x6",
        barcodeText: trackingNumber,
        generatedAt: Date.now(),
      },
    };
  },
});
