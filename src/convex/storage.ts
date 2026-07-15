import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const uploadAvatar = mutation({
  args: {
    userId: v.id("users"),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const uploadUrl = await (ctx.storage as any).generateUploadUrl();
    const parsed = new URL(uploadUrl);
    const storageId = parsed.searchParams.get("uploadId");

    return {
      uploadUrl,
      storageId,
      fileType: args.fileType,
    };
  },
});

export const updateAvatar = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(args.userId, {
      avatar_storage_id: args.storageId,
    });

    return { success: true };
  },
});

export const getAvatarUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await (ctx.storage as any).getUrl(args.storageId);

    if (!url) {
      return null;
    }

    return { url };
  },
});
