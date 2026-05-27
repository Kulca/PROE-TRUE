import RegisterForm from "./RegisterForm";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="px-8 py-5 border-b border-border">
        <a href="/" className="font-serif text-2xl text-accent-primary">Proe</a>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}
