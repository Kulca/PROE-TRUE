import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    campaign_id: v.id("campaigns"),
    user_id: v.id("users"),
    claim_id: v.id("claims"),
    ratings: v.number(),
    written_feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.ratings < 1 || args.ratings > 5) {
      throw new Error("Ratings must be between 1 and 5.");
    }

    const claim = await ctx.db.get(args.claim_id);
    if (!claim) {
      throw new Error("Claim not found.");
    }

    if (claim.user_id !== args.user_id || claim.campaign_id !== args.campaign_id) {
      throw new Error("Claim does not belong to this user/campaign.");
    }

    const alreadySubmitted = await ctx.db
      .query("surveys")
      .withIndex("by_claim", (q) => q.eq("claim_id", args.claim_id))
      .unique();

    if (alreadySubmitted) {
      throw new Error("Survey already submitted for this claim.");
    }

    const surveyId = await ctx.db.insert("surveys", {
      campaign_id: args.campaign_id,
      user_id: args.user_id,
      claim_id: args.claim_id,
      ratings: args.ratings,
      written_feedback: args.written_feedback,
      submitted_at: Date.now(),
    });

    return { surveyId, success: true };
  },
});

export const getByUser = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const surveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .order("desc")
      .collect();

    return await Promise.all(
      surveys.map(async (survey) => {
        const campaign = await ctx.db.get(survey.campaign_id);
        return {
          ...survey,
          campaign,
        };
      }),
    );
  },
});

export const canClaim = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    const blockingClaims = [];

    for (const claim of claims) {
      if (claim.shipping_status === "ready_for_pickup" || claim.shipping_status === "collected") {
        const survey = await ctx.db
          .query("surveys")
          .withIndex("by_claim", (q) => q.eq("claim_id", claim._id))
          .unique();

        if (!survey) {
          blockingClaims.push(claim._id);
        }
      }
    }

    return {
      canClaim: blockingClaims.length === 0,
      blockingClaimIds: blockingClaims,
    };
  },
});

export const pendingByUser = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    const pending = [];

    for (const claim of claims) {
      if (claim.shipping_status !== "ready_for_pickup" && claim.shipping_status !== "collected") {
        continue;
      }

      const existing = await ctx.db
        .query("surveys")
        .withIndex("by_claim", (q) => q.eq("claim_id", claim._id))
        .unique();

      if (!existing) {
        const campaign = await ctx.db.get(claim.campaign_id);
        pending.push({ claim, campaign });
      }
    }

    return pending;
  },
});
