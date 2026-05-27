import Link from "next/link";
import { ArrowRight, Package, MapPin, Star } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <h1 className="font-serif text-2xl text-accent-primary">Proe</h1>
        <nav className="flex gap-6">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm bg-accent-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4">
        <span className="text-sm font-medium text-accent-primary tracking-widest uppercase mb-4">
          South Africa's Freebie Marketplace
        </span>
        <h2 className="font-serif text-6xl max-w-3xl leading-tight mb-6">
          Taste before you buy,<br /> collect at your door.
        </h2>
        <p className="text-lg text-text-secondary max-w-xl mb-10">
          Discover free samples from South African brands. We deliver to PUDO smart lockers near you — free, simple, and zero hassle.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register?role=consumer"
            className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded font-medium hover:bg-orange-600 transition-colors"
          >
            I'm a Tester <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register?role=brand"
            className="inline-flex items-center gap-2 bg-white text-accent-primary border border-accent-primary px-6 py-3 rounded font-medium hover:bg-orange-50 transition-colors"
          >
            I'm a Brand
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-20 max-w-5xl mx-auto border-t border-border">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-accent-primary/10 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-accent-primary" />
          </div>
          <h3 className="font-serif text-xl">Free Samples</h3>
          <p className="text-text-secondary text-sm">
            Get free products from top SA brands. New launches, clearances, and exclusive testers-only offers.
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-accent-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-accent-primary" />
          </div>
          <h3 className="font-serif text-xl">PUDO Lockers</h3>
          <p className="text-text-secondary text-sm">
            Collect at a PUDO smart locker near you. No home address needed, no delivery waiting.
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-accent-primary/10 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-accent-primary" />
          </div>
          <h3 className="font-serif text-xl">Honest Feedback</h3>
          <p className="text-text-secondary text-sm">
            Share your taste. Your reviews help brands improve and help others discover great products.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-text-muted border-t border-border">
        <p>© 2024 Proe. Free samples, South African taste.</p>
      </footer>
    </main>
  );
}