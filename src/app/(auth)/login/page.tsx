"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = React.useState<"password" | "magic">("password");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, we'd check the role and redirect
      router.push("/consumer/marketplace");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-page">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-subtle bg-accent-primary" />
            <span className="text-2xl font-serif font-bold tracking-tight">Proe</span>
          </Link>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                {method === "password" 
                  ? "Login with your email and password." 
                  : "Enter your email to receive a magic login link."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Email Address" type="email" placeholder="john@example.com" required />
              {method === "password" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">Password</label>
                    <Link href="#" className="text-xs text-accent-primary hover:underline">Forgot password?</Link>
                  </div>
                  <Input type="password" placeholder="••••••••" required />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {method === "password" ? "Login" : "Send Magic Link"}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-bg-card px-2 text-text-muted">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="secondary" 
                className="w-full"
                onClick={() => setMethod(method === "password" ? "magic" : "password")}
              >
                {method === "password" ? (
                  <><Mail className="mr-2 h-4 w-4" /> Magic Link</>
                ) : (
                  "Password Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
