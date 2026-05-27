"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "brand" ? "brand" : "consumer";
  
  const [role, setRole] = React.useState<"brand" | "consumer">(initialRole);
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRoleSelect = (selectedRole: "brand" | "consumer") => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration
    setTimeout(() => {
      setIsLoading(false);
      router.push(role === "brand" ? "/brand/onboarding" : "/consumer/marketplace");
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

        {step === 1 ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-serif text-center mb-6">Choose your role</h1>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleRoleSelect("consumer")}
                className={cn(
                  "flex items-center gap-4 p-6 rounded-card border-2 transition-all text-left bg-bg-card",
                  role === "consumer" ? "border-accent-primary" : "border-transparent hover:border-border"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">I&apos;m a Tester</h3>
                  <p className="text-sm text-text-secondary">Discover and claim free samples from brands.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-text-muted" />
              </button>

              <button
                onClick={() => handleRoleSelect("brand")}
                className={cn(
                  "flex items-center gap-4 p-6 rounded-card border-2 transition-all text-left bg-bg-card",
                  role === "brand" ? "border-accent-primary" : "border-transparent hover:border-border"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-accent-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">I&apos;m a Brand</h3>
                  <p className="text-sm text-text-secondary">List products and get feedback from consumers.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-text-muted" />
              </button>
            </div>
            <p className="text-center text-sm text-text-muted mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-accent-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        ) : (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Create your {role} account</CardTitle>
                <CardDescription>Enter your details to get started with Proe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Full Name" placeholder="John Doe" required />
                <Input label="Email Address" type="email" placeholder="john@example.com" required />
                <Input label="Password" type="password" placeholder="••••••••" required />
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1 rounded border-border text-accent-primary focus:ring-accent-primary" required />
                  <label htmlFor="terms" className="text-xs text-text-secondary">
                    I agree to the <Link href="#" className="text-accent-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-accent-primary hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Go back
                </button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
