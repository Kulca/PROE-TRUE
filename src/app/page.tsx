import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-subtle bg-accent-primary" />
          <span className="text-2xl font-serif font-bold tracking-tight">Proe</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-text-primary mb-6 animate-reveal">
            Taste the best of <br /> South African Brands.
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-reveal" style={{ animationDelay: "100ms" }}>
            Discover free samples, launch new products, and clear inventory with the power of PUDO smart lockers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal" style={{ animationDelay: "200ms" }}>
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Join as a Tester <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=brand">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                List your Brand
              </Button>
            </Link>
          </div>
        </section>

        {/* Value Props */}
        <section className="px-6 py-24 bg-bg-secondary">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="text-xl font-serif mb-3">Effortless Discovery</h3>
              <p className="text-text-secondary">Browse a curated marketplace of freebies and samples from top SA brands.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center mb-6">
                <Box className="h-6 w-6 text-accent-secondary" />
              </div>
              <h3 className="text-xl font-serif mb-3">Smart Logistics</h3>
              <p className="text-text-secondary">Powered by PUDO smart lockers. Pick up your samples whenever it suits you.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-serif mb-3">Trusted Feedback</h3>
              <p className="text-text-secondary">Brands get real insights, while testers get first access to new launches.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-border bg-bg-primary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-subtle bg-accent-primary" />
            <span className="text-lg font-serif font-bold tracking-tight">Proe</span>
          </div>
          <p className="text-sm text-text-muted">© 2024 Proe Marketplace. Built for South Africa.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-text-muted hover:text-accent-primary transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-text-muted hover:text-accent-primary transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-text-muted hover:text-accent-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
