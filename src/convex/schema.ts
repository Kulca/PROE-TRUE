import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    role: v.union(v.literal("brand"), v.literal("consumer")),
    preferred_pudo_locker_id: v.optional(v.string()),
    pudo_locker_address: v.optional(v.string()),
    size_preferences: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  campaigns: defineTable({
    brand_id: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("new_launch"),
      v.literal("clearance"),
      v.literal("out_of_season"),
      v.literal("odd_sizing"),
      v.literal("closing_down")
    ),
    inventory_count: v.number(),
    pudo_box_size_required: v.union(v.literal("XS"), v.literal("S"), v.literal("M"), v.literal("L"), v.literal("XL")),
    image_url: v.optional(v.string()),
    is_active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_brand", ["brand_id"])
    .index("by_category", ["category"])
    .index("by_active", ["is_active"]),

  claims: defineTable({
    user_id: v.id("users"),
    campaign_id: v.id("campaigns"),
    pudo_pin_code: v.string(),
    shipping_status: v.union(
      v.literal("pending"),
      v.literal("in_transit"),
      v.literal("ready_for_pickup"),
      v.literal("collected")
    ),
    pudo_tracking_number: v.optional(v.string()),
    selected_locker_id: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_campaign", ["campaign_id"])
    .index("by_status", ["shipping_status"]),

  surveys: defineTable({
    campaign_id: v.id("campaigns"),
    user_id: v.id("users"),
    claim_id: v.id("claims"),
    ratings: v.number(),
    written_feedback: v.optional(v.string()),
    submitted_at: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_campaign", ["campaign_id"])
    .index("by_claim", ["claim_id"]),

  pudo_lockers: defineTable({
    locker_id: v.string(),
    name: v.string(),
    address: v.string(),
    province: v.string(),
    coordinates: v.object({ lat: v.number(), lng: v.number() }),
    is_active: v.boolean(),
  })
    .index("by_province", ["province"])
    .index("by_locker_id", ["locker_id"]),
});