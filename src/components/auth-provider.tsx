"use client";
import * as React from "react";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "brand" | "consumer" | "admin";
  is_verified?: boolean;
  avatar_storage_id?: string;
  phone_number?: string;
  preferred_pudo_locker_id?: string;
  pudo_locker_address?: string;
  brand_details?: {
    company_name?: string;
    description?: string;
    industry?: string;
    social_links?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  verification_docs?: {
    status?: "pending" | "verified" | "rejected";
  };
  createdAt?: number;
}

interface AuthContextValue {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read the proe_session cookie from the browser
  const [sessionToken, setSessionToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((c) => c.startsWith("proe_session="));
    if (sessionCookie) {
      setSessionToken(sessionCookie.split("=")[1]);
    } else {
      setSessionToken(null);
    }
  }, []);

  // Use the auth.me query to get the current user
  const user = useQuery(
    api.auth.me,
    sessionToken ? { session_token: sessionToken } : "skip"
  );

  const value: AuthContextValue = {
    user: user as AuthUser | null | undefined,
    isLoading: user === undefined,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}