import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { SOUTH_AFRICA_PUDO_LOCKERS } from "./pudoLockers";

const boxSize = v.union(
  v.literal("XS"),
  v.literal("S"),
  v.literal("M"),
  v.literal("L"),
  v.literal("XL"),
);

const zone = v.union(v.literal("local"), v.literal("regional"), v.literal("national"));

const BASE_PRICING: Record<"XS" | "S" | "M" | "L" | "XL", number> = {
  XS: 25,
  S: 35,
  M: 50,
  L: 70,
  XL: 95,
};

const ZONE_MULTIPLIER: Record<"local" | "regional" | "national", number> = {
  local: 1,
  regional: 1.25,
  national: 1.5,
};

export const listLockers = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 100, 1), 200);
    const search = args.search?.trim().toLowerCase();

    let lockers = await ctx.db.query("pudo_lockers").collect();
    lockers = lockers.filter((locker) => locker.is_active);

    if (search) {
      lockers = lockers.filter(
        (locker) =>
          locker.name.toLowerCase().includes(search) ||
          locker.address.toLowerCase().includes(search) ||
          locker.province.toLowerCase().includes(search),
      );
    }

    return lockers.slice(0, limit);
  },
});

export const searchByProvince = query({
  args: {
    province: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pudo_lockers")
      .withIndex("by_province", (q) => q.eq("province", args.province))
      .collect();
  },
});

export const calculatePrice = query({
  args: {
    boxSize,
    zone: v.optional(zone),
    quantity: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const deliveryZone = args.zone ?? "local";
    const quantity = Math.max(args.quantity ?? 1, 1);

    const basePrice = BASE_PRICING[args.boxSize];
    const multiplier = ZONE_MULTIPLIER[deliveryZone];
    const unitPrice = Math.round(basePrice * multiplier * 100) / 100;
    const total = Math.round(unitPrice * quantity * 100) / 100;

    return {
      currency: "ZAR",
      boxSize: args.boxSize,
      zone: deliveryZone,
      quantity,
      unitPrice,
      total,
    };
  },
});

export const seedLockers = mutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    let updated = 0;

    for (const locker of SOUTH_AFRICA_PUDO_LOCKERS) {
      const existing = await ctx.db
        .query("pudo_lockers")
        .withIndex("by_locker_id", (q) => q.eq("locker_id", locker.locker_id))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          name: locker.name,
          address: locker.address,
          province: locker.province,
          coordinates: locker.coordinates,
          is_active: locker.is_active,
        });
        updated += 1;
      } else {
        await ctx.db.insert("pudo_lockers", locker);
        inserted += 1;
      }
    }

    return {
      success: true,
      inserted,
      updated,
      total: SOUTH_AFRICA_PUDO_LOCKERS.length,
    };
  },
});
