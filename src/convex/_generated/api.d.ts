// Stub for `@/convex/_generated/api` — replace with actual `convex codegen` output from Convex dashboard
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";

export declare const api: {
  query: {
    args: Record<string, unknown>;
    handler: (ctx: GenericQueryCtx, args: Record<string, unknown>) => unknown;
  };
  mutation: {
    args: Record<string, unknown>;
    handler: (ctx: GenericMutationCtx, args: Record<string, unknown>) => unknown;
  };
};
export declare const functions: Record<string, unknown>;
