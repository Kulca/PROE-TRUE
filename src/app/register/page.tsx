"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Role = "brand" | "consumer";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") as Role | null;
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Convex auth registration
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="px-8 py-5 border-b border-border">
        <Link href="/" className="font-serif text-2xl text-accent-primary">Proe</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl mb-2">Create your account</h1>
            <p className="text-text-secondary">
              {step === 1 ? "How will you use Proe?" : "Set up your profile"}
            </p>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleRoleSelect("consumer")}
                className="p-6 border border-border rounded bg-bg-card text-left hover:border-accent-primary hover:shadow-card transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">I'm a Tester</h3>
                    <p className="text-sm text-text-secondary">Discover free samples, claim freebies, and share your honest feedback.</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect("brand")}
                className="p-6 border border-border rounded bg-bg-card text-left hover:border-accent-secondary hover:shadow-card transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-secondary/10 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">I'm a Brand</h3>
                    <p className="text-sm text-text-secondary">Launch campaigns, offload surplus, and get real feedback from SA testers.</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="mb-4 p-3 bg-bg-secondary rounded text-sm">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  role === "brand" ? "bg-accent-secondary/10 text-accent-secondary" : "bg-accent-primary/10 text-accent-primary"
                )}>
                  {role === "brand" ? "Brand" : "Tester"}
                </span>
              </div>
              <Input id="name" label="Full name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input id="email" type="email" label="Email address" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input id="password" type="password" label="Password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button type="submit" loading={loading} className="flex-1">Create Account</Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}