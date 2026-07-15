import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const SALT_ROUNDS = 10;
const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const toPublicUser = (user: any) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  email_verified: user.email_verified,
  avatar_storage_id: user.avatar_storage_id,
  preferred_pudo_locker_id: user.preferred_pudo_locker_id,
  pudo_locker_address: user.pudo_locker_address,
  size_preferences: user.size_preferences,
  createdAt: user.createdAt,
});

async function sendVerificationEmail(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${appUrl.replace(/\/$/, "")}/verify-email?token=${token}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Proe <noreply@proe.co.za>",
      to: email,
      subject: "Verify your Proe account",
      html: `Click <a href=\"${verifyUrl}\">here</a> to verify your email.`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send verification email: ${body}`);
  }
}

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("brand"), v.literal("consumer")),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(args.password, SALT_ROUNDS);
    const verificationToken = randomUUID();
    const expiresAt = Date.now() + EMAIL_VERIFY_TTL_MS;

    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email,
      password: passwordHash,
      role: args.role,
      is_verified: false,
      email_verified: false,
      verification_token: verificationToken,
      verification_token_expires: expiresAt,
      createdAt: Date.now(),
    });

    await ctx.db.insert("email_verification_tokens", {
      token: verificationToken,
      user_id: userId,
      expires_at: expiresAt,
    });

    await sendVerificationEmail(email, verificationToken);

    return { success: true, userId };
  },
});

export const verifyEmail = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("email_verification_tokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!record || record.expires_at < Date.now()) {
      throw new Error("Verification token is invalid or expired.");
    }

    const user = await ctx.db.get(record.user_id);
    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(record.user_id, {
      email_verified: true,
      verification_token: undefined,
      verification_token_expires: undefined,
    });

    await ctx.db.delete(record._id);

    return { success: true };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user || !user.password) {
      throw new Error("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(args.password, user.password);
    if (!validPassword) {
      throw new Error("Invalid email or password.");
    }

    const sessionToken = randomUUID();
    const expiresAt = Date.now() + SESSION_TTL_MS;

    await ctx.db.insert("sessions", {
      token: sessionToken,
      user_id: user._id,
      expires_at: expiresAt,
    });

    return {
      success: true,
      sessionToken,
      expiresAt,
      user: toPublicUser(user),
    };
  },
});

export const me = query({
  args: {
    session_token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.session_token) {
      return null;
    }

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.session_token!))
      .first();

    if (!session || session.expires_at < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.user_id);
    if (!user) {
      return null;
    }

    return toPublicUser(user);
  },
});

export const logout = mutation({
  args: {
    session_token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.session_token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Backwards compatible aliases while frontend pivots off social auth.
export const signUp = register;
export const signIn = login;

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
