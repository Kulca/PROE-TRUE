import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const campaignCategory = v.union(
  v.literal("new_launch"),
  v.literal("clearance"),
  v.literal("out_of_season"),
  v.literal("odd_sizing"),
  v.literal("closing_down"),
);

const boxSize = v.union(
  v.literal("XS"),
  v.literal("S"),
  v.literal("M"),
  v.literal("L"),
  v.literal("XL"),
);

export const create = mutation({
  args: {
    brand_id: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: campaignCategory,
    inventory_count: v.number(),
    pudo_box_size_required: boxSize,
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.inventory_count <= 0) {
      throw new Error("Inventory count must be greater than zero.");
    }

    const brand = await ctx.db.get(args.brand_id);
    if (!brand || brand.role !== "brand") {
      throw new Error("Only brand users can create campaigns.");
    }

    const campaignId = await ctx.db.insert("campaigns", {
      ...args,
      title: args.title.trim(),
      description: args.description.trim(),
      is_active: true,
      createdAt: Date.now(),
    });

    return { campaignId, success: true };
  },
});

export const list = query({
  args: {
    category: v.optional(campaignCategory),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      let categoryCampaigns = await ctx.db
        .query("campaigns")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();

      if (args.activeOnly ?? true) {
        categoryCampaigns = categoryCampaigns.filter((campaign) => campaign.is_active);
      }

      return categoryCampaigns.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (args.activeOnly ?? true) {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_active", (q) => q.eq("is_active", true))
        .order("desc")
        .collect();
    }

    return await ctx.db.query("campaigns").order("desc").collect();
  },
});

export const getById = query({
  args: {
    campaign_id: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaign_id);
    if (!campaign) {
      throw new Error("Campaign not found.");
    }

    const brand = await ctx.db.get(campaign.brand_id);

    return {
      ...campaign,
      brand: brand
        ? {
            id: brand._id,
            name: brand.name,
            email: brand.email,
          }
        : null,
    };
  },
});

export const listByBrand = query({
  args: {
    brand_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    campaign_id: v.id("campaigns"),
    actor_brand_id: v.id("users"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(campaignCategory),
    inventory_count: v.optional(v.number()),
    pudo_box_size_required: v.optional(boxSize),
    image_url: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaign_id);
    if (!campaign) {
      throw new Error("Campaign not found.");
    }

    if (campaign.brand_id !== args.actor_brand_id) {
      throw new Error("You are not allowed to update this campaign.");
    }

    if (args.inventory_count !== undefined && args.inventory_count < 0) {
      throw new Error("Inventory count cannot be negative.");
    }

    await ctx.db.patch(args.campaign_id, {
      title: args.title?.trim(),
      description: args.description?.trim(),
      category: args.category,
      inventory_count: args.inventory_count,
      pudo_box_size_required: args.pudo_box_size_required,
      image_url: args.image_url,
      is_active: args.is_active,
    });

    return { success: true };
  },
});

export const deactivate = mutation({
  args: {
    campaign_id: v.id("campaigns"),
    actor_brand_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaign_id);
    if (!campaign) {
      throw new Error("Campaign not found.");
    }

    if (campaign.brand_id !== args.actor_brand_id) {
      throw new Error("You are not allowed to deactivate this campaign.");
    }

    await ctx.db.patch(args.campaign_id, { is_active: false });

    return { success: true };
  },
});
