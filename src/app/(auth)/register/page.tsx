"use client";
import * as React from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, ArrowRight, AlertCircle, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";

export default function RegisterPage() {
  const [role, setRole] = React.useState<"brand" | "consumer">("consumer");
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [registered, setRegistered] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);

  const signUp = useMutation(api.auth.signUp);

  const handleRoleSelect = (selectedRole: "brand" | "consumer") => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !agreed) return;
    setIsLoading(true);
    setError("");

    try {
      await signUp({ name, email, password, role });
      setRegisteredEmail(email);
      setRegistered(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (registered) {
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
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We sent a verification email to <strong>{registeredEmail}</strong>. Click the link in the email to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  You won&apos;t be able to log in until you verify your email. Check your spam folder if you don&apos;t see the email.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Account created successfully</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button className="w-full" variant="outline">Go to Login</Button>
              </Link>
              <p className="text-xs text-text-muted text-center">
                Didn&apos;t receive the email? Check your spam folder or try registering again.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif font-bold text-text-primary mb-2">Join Proe</h1>
              <p className="text-text-secondary text-sm">Choose how you want to use Proe.</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => handleRoleSelect("consumer")}
                className={cn("w-full flex items-center gap-4 p-4 rounded-card border-2 border-border bg-bg-card hover:bg-bg-secondary transition-all text-left group",
                  role === "consumer" ? "border-accent-primary" : "border-transparent hover:border-border"
                )}>
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">I&apos;m a Tester</h3>
                  <p className="text-sm text-text-secondary">Discover and claim free samples from brands.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-text-muted" />
              </button>
              <button onClick={() => handleRoleSelect("brand")}
                className={cn("w-full flex items-center gap-4 p-4 rounded-card border-2 border-border bg-bg-card hover:bg-bg-secondary transition-all text-left group",
                  role === "brand" ? "border-accent-primary" : "border-transparent hover:border-border"
                )}>
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
              <Link href="/login" className="text-accent-primary font-medium hover:underline">Login</Link>
            </p>
          </div>
        ) : (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Create your {role === "brand" ? "brand" : "tester"} account</CardTitle>
                <CardDescription>Join Proe as a {role === "brand" ? "brand" : "tester"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </div>
                )}
                <Input label="Full Name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email Address" type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1 rounded border-border text-accent-primary focus:ring-accent-primary cursor-pointer"
                    checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
                  <label htmlFor="terms" className="text-xs text-text-secondary cursor-pointer">
                    I agree to the <Link href="/terms" className="text-accent-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-accent-primary hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" isLoading={isLoading} disabled={!agreed || !name || !email || !password}>
                  Create Account
                </Button>
                <button type="button" onClick={() => setStep(1)} className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
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