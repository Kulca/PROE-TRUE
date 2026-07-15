"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

function createConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.warn(
      "[Proe] NEXT_PUBLIC_CONVEX_URL is not set. Convex features will be disabled. " +
        "Run `npx convex dev` or set CONVEX_DEPLOYMENT in your .env.local"
    );
    return null;
  }
  return new ConvexReactClient(url);
}

const convex = createConvexClient();

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    // Render without Convex when not configured — lets the page shell load
    return <>{children}</>;
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
