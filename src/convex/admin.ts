import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateVerificationStatus = mutation({
  args: {
    user_id: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("verified"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user) throw new Error("User not found");
    
    await ctx.db.patch(args.user_id, {
      verification_docs: {
        ...user.verification_docs,
        status: args.status,
      }
    });
    return { success: true };
  },
});

export const getAllCampaigns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("campaigns").collect();
  },
});

export const toggleCampaignFeatured = mutation({
  args: {
    campaign_id: v.id("campaigns"),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaign_id, {
      featured: args.featured,
    });
    return { success: true };
  },
});

export const getAllClaims = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("claims").collect();
  },
});

export const getAllSurveys = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("surveys").collect();
  },
});
