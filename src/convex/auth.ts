import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const SALT_ROUNDS = 10;

export const signUp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    role: v.union(v.literal("brand"), v.literal("consumer")),
    size_preferences: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", email))
      .unique();

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    // Hash the password if provided
    let hashedPassword: string | undefined;
    if (args.password) {
      hashedPassword = bcrypt.hashSync(args.password, SALT_ROUNDS);
    }

    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email,
      password: hashedPassword,
      phone_number: args.phone_number,
      role: args.role,
      preferred_pudo_locker_id: undefined,
      pudo_locker_address: undefined,
      size_preferences: args.size_preferences,
      createdAt: Date.now(),
    });

    return {
      userId,
      role: args.role,
      message: "Account created successfully",
    };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("No account found for this email.");
    }

    if (user.password && args.password) {
      // Support both bcrypt hashes and legacy plain-text passwords
      const isValid = bcrypt.compareSync(args.password, user.password)
        || user.password === args.password;
      if (!isValid) {
        throw new Error("Invalid password.");
      }
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferred_pudo_locker_id: user.preferred_pudo_locker_id,
      pudo_locker_address: user.pudo_locker_address,
      size_preferences: user.size_preferences,
    };
  },
});

export const magicLink = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("No account found for this email.");
    }

    const token = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    const expiresAt = Date.now() + 15 * 60 * 1000;

    return {
      email,
      magicLink: `https://proe.app/login?email=${encodeURIComponent(email)}&token=${token}`,
      expiresAt,
      message: "Magic link generated (mock for MVP).",
    };
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const updatePreferences = mutation({
  args: {
    user_id: v.id("users"),
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
    phone_number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(args.user_id, {
      preferred_pudo_locker_id: args.preferred_pudo_locker_id,
      pudo_locker_address: args.pudo_locker_address,
      size_preferences: args.size_preferences,
      category_interests: args.category_interests,
      notification_settings: args.notification_settings,
      onboardingStep: args.onboardingStep,
      brand_details: args.brand_details,
      verification_docs: args.verification_docs,
      shipping_setup: args.shipping_setup,
      phone_number: args.phone_number,
    });

    return { success: true };
  },
});
