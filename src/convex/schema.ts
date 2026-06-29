import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    role: v.union(v.literal("brand"), v.literal("consumer"), v.literal("admin")),
    preferred_pudo_locker_id: v.optional(v.string()),
    pudo_locker_address: v.optional(v.string()),
    size_preferences: v.optional(v.array(v.string())),
    category_interests: v.optional(v.array(v.string())),
    notification_settings: v.optional(v.object({
      email: v.boolean(),
      sms: v.boolean(),
      push: v.boolean(),
    })),
    onboardingStep: v.optional(v.number()),
    brand_details: v.optional(v.object({
      company_name: v.string(),
      logo_url: v.optional(v.string()),
      description: v.string(),
      industry: v.string(),
      social_links: v.optional(v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })),
    })),
    verification_docs: v.optional(v.object({
      company_reg: v.optional(v.string()),
      tax_clearance: v.optional(v.string()),
      address_proof: v.optional(v.string()),
      status: v.union(v.literal("pending"), v.literal("verified"), v.literal("rejected")),
    })),
    shipping_setup: v.optional(v.object({
      pudo_account_id: v.optional(v.string()),
      manual_address: v.optional(v.string()),
    })),
    is_verified: v.boolean(),
    createdAt: v.number(),
  }).index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_verified", ["is_verified"]),

  campaigns: defineTable({
    brand_id: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("new_launch"),
      v.literal("clearance"),
      v.literal("out_of_season"),
      v.literal("odd_sizing"),
      v.literal("closing_down"),
    ),
    inventory_count: v.number(),
    pudo_box_size_required: v.union(
      v.literal("XS"),
      v.literal("S"),
      v.literal("M"),
      v.literal("L"),
      v.literal("XL"),
    ),
    image_url: v.optional(v.string()),
    is_active: v.boolean(),
    is_featured: v.boolean(),
    billboard_opt_in: v.boolean(),
    campaign_story: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_brand", ["brand_id"])
    .index("by_category", ["category"])
    .index("by_active", ["is_active"])
    .index("by_featured", ["is_featured"]),

  claims: defineTable({
    user_id: v.id("users"),
    campaign_id: v.id("campaigns"),
    pudo_pin_code: v.string(),
    shipping_status: v.union(
      v.literal("pending"),
      v.literal("in_transit"),
      v.literal("ready_for_pickup"),
      v.literal("collected"),
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

  subscriptions: defineTable({
    user_id: v.id("users"),
    tier: v.union(v.literal("free"), v.literal("premium")),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("past_due"),
      v.literal("trialing"),
    ),
    provider: v.literal("payu"),
    provider_subscription_id: v.optional(v.string()),
    provider_customer_id: v.optional(v.string()),
    current_period_start: v.number(),
    current_period_end: v.number(),
    cancelled_at: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_status", ["status"])
    .index("by_provider_sub", ["provider_subscription_id"]),

  invoices: defineTable({
    user_id: v.id("users"),
    subscription_id: v.optional(v.id("subscriptions")),
    amount_zar: v.number(),
    status: v.union(
      v.literal("paid"),
      v.literal("pending"),
      v.literal("failed"),
      v.literal("refunded"),
    ),
    provider: v.literal("payu"),
    provider_invoice_id: v.optional(v.string()),
    description: v.string(),
    paid_at: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_status", ["status"])
    .index("by_subscription", ["subscription_id"]),

  brand_balances: defineTable({
    brand_id: v.id("users"),
    balance_zar: v.number(),
    pending_commission_zar: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_brand", ["brand_id"]),

  transactions: defineTable({
    brand_id: v.id("users"),
    type: v.union(
      v.literal("commission_charged"),
      v.literal("subscription_charge"),
      v.literal("payout"),
      v.literal("refund"),
      v.literal("topup"),
    ),
    amount_zar: v.number(),
    claim_id: v.optional(v.id("claims")),
    invoice_id: v.optional(v.id("invoices")),
    description: v.string(),
    createdAt: v.number(),
  })
    .index("by_brand", ["brand_id"])
    .index("by_type", ["type"])
    .index("by_created", ["createdAt"]),

  payouts: defineTable({
    brand_id: v.id("users"),
    amount_zar: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    provider: v.literal("payu"),
    provider_payout_id: v.optional(v.string()),
    bank_account: v.string(),
    requested_at: v.number(),
    processed_at: v.optional(v.number()),
  })
    .index("by_brand", ["brand_id"])
    .index("by_status", ["status"]),

  pudo_lockers: defineTable({
    locker_id: v.string(),
    name: v.string(),
    address: v.string(),
    province: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    is_active: v.boolean(),
  })
    .index("by_province", ["province"])
    .index("by_locker_id", ["locker_id"]),
});
