"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Convex auth will be integrated here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="px-8 py-5 border-b border-border">
        <Link href="/" className="font-serif text-2xl text-accent-primary">Proe</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl mb-2">Welcome back</h1>
            <p className="text-text-secondary">Sign in to your Proe account</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}