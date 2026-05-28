import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all users (for admin)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("users").collect();
  },
});

// List pending brand verification requests
export const listPendingBrands = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.filter(
      (u) => u.role === "brand" && u.verification_docs?.status === "pending"
    );
  },
});

// Approve/reject brand verification
export const verifyBrand = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("verified"), v.literal("rejected")),
  },
  handler: async (ctx, { userId, status }) => {
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "brand") {
      throw new Error("User not found or not a brand");
    }
    await ctx.db.patch(userId, {
      is_verified: status === "verified",
      verification_docs: {
        ...user.verification_docs,
        status,
      },
    });
    return { success: true, status };
  },
});

// Admin: list all campaigns
export const listAllCampaigns = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("campaigns").collect();
  },
});

// Admin: toggle featured status
export const toggleFeatured = mutation({
  args: {
    campaignId: v.id("campaigns"),
    is_featured: v.boolean(),
  },
  handler: async (ctx, { campaignId, is_featured }) => {
    await ctx.db.patch(campaignId, { is_featured });
    return { success: true };
  },
});

// Admin: list all claims
export const listAllClaims = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("claims").collect();
  },
});

// Admin: list all surveys
export const listAllSurveys = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("surveys").collect();
  },
});

// Admin: get platform stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const campaigns = await ctx.db.query("campaigns").collect();
    const claims = await ctx.db.query("claims").collect();
    const surveys = await ctx.db.query("surveys").collect();

    const brands = users.filter((u) => u.role === "brand");
    const consumers = users.filter((u) => u.role === "consumer");
    const verifiedBrands = brands.filter((b) => b.is_verified);
    const pendingBrands = brands.filter(
      (b) => b.verification_docs?.status === "pending"
    );

    return {
      totalUsers: users.length,
      totalBrands: brands.length,
      totalConsumers: consumers.length,
      verifiedBrands: verifiedBrands.length,
      pendingVerification: pendingBrands.length,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.is_active).length,
      totalClaims: claims.length,
      collectedClaims: claims.filter((c) => c.shipping_status === "collected")
        .length,
      totalSurveys: surveys.length,
      avgRating:
        surveys.length > 0
          ? surveys.reduce((sum, s) => sum + s.ratings, 0) / surveys.length
          : 0,
    };
  },
});

// List billboard-eligible campaigns (opted in, active, with story)
export const listBillboardCampaigns = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_active", (q) => q.eq("is_active", true))
      .collect();
    return campaigns.filter(
      (c) => c.billboard_opt_in && !!c.campaign_story
    );
  },
});
