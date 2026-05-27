"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { 
  Building2, 
  Upload, 
  Truck, 
  CheckCircle2, 
  Instagram, 
  Facebook, 
  Twitter, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Brand Story", icon: Building2 },
  { id: 2, title: "Verification", icon: FileText },
  { id: 3, title: "Shipping", icon: Truck },
  { id: 4, title: "Launch", icon: Sparkles },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const nextStep = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, STEPS.length));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast("success", "Onboarding complete! Welcome to Proe.");
      router.push("/brand/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-subtle bg-accent-primary" />
            <span className="text-xl font-serif font-bold tracking-tight">Proe</span>
          </div>
          <div className="text-sm text-text-muted">
            Step {step} of {STEPS.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-border rounded-full overflow-hidden flex">
          {STEPS.map((s) => (
            <div 
              key={s.id}
              className={cn(
                "h-full transition-all duration-500 ease-in-out border-r border-bg-secondary last:border-none",
                step >= s.id ? "bg-accent-primary" : "bg-border",
                "flex-1"
              )}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 1 && <BrandStoryStep onNext={nextStep} />}
            {step === 2 && <VerificationStep onNext={nextStep} onPrev={prevStep} />}
            {step === 3 && <ShippingStep onNext={nextStep} onPrev={prevStep} />}
            {step === 4 && <LaunchStep onComplete={handleComplete} onPrev={prevStep} isLoading={isLoading} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function BrandStoryStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2 text-accent-primary">
          <Building2 className="h-6 w-6" />
          <Badge variant="accent">Step 1</Badge>
        </div>
        <CardTitle className="text-3xl font-serif">Tell your brand story</CardTitle>
        <CardDescription>Let&apos;s set up your brand profile for consumers to see.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-32 h-32 rounded-card border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all cursor-pointer bg-bg-secondary/50 group">
            <ImageIcon className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-center px-2">Upload Logo</span>
          </div>
          <div className="flex-1 space-y-4">
            <Input label="Company Name" placeholder="e.g. Karoo Luxe" required />
            <Input label="Industry / Category" placeholder="e.g. Artisan Cosmetics" required />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Brand Description</label>
          <textarea 
            className="w-full min-h-[120px] p-3 rounded-card border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
            placeholder="Tell us about your mission, where you&apos;ve from, and what makes your products special..."
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Social Media Links</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input className="pl-10" placeholder="@instagram" />
            </div>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input className="pl-10" placeholder="Facebook URL" />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input className="pl-10" placeholder="@twitter" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6 flex justify-end">
        <Button onClick={onNext} size="lg" className="px-8">
          Next: Verification <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function VerificationStep({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [files, setFiles] = React.useState<Record<string, boolean>>({
    reg: false,
    tax: false,
    address: false,
  });

  const toggleFile = (key: string) => {
    setFiles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2 text-accent-primary">
          <FileText className="h-6 w-6" />
          <Badge variant="accent">Step 2</Badge>
        </div>
        <CardTitle className="text-3xl font-serif">Brand Verification</CardTitle>
        <CardDescription>Upload your documents to become a verified supplier on Proe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-card flex gap-4">
          <Sparkles className="h-6 w-6 text-accent-primary shrink-0" />
          <p className="text-sm text-text-primary leading-relaxed">
            Verified brands receive a <strong>Gold Badge</strong>, priority marketplace placement, and access to premium analytics.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { id: "reg", label: "CIPC Company Registration", desc: "Official proof of registration" },
            { id: "tax", label: "SARS Tax Clearance", desc: "Proof of tax compliance" },
            { id: "address", label: "Proof of Business Address", desc: "Utility bill or lease agreement" },
          ].map((doc) => (
            <div 
              key={doc.id}
              className={cn(
                "p-4 rounded-card border-2 transition-all flex items-center justify-between",
                files[doc.id] ? "border-success bg-success/5" : "border-dashed border-border bg-bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  files[doc.id] ? "bg-success/20 text-success" : "bg-bg-card text-text-muted"
                )}>
                  {files[doc.id] ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{doc.label}</h4>
                  <p className="text-xs text-text-secondary">{doc.desc}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(files[doc.id] ? "text-success" : "text-accent-primary")}
                onClick={() => toggleFile(doc.id)}
              >
                {files[doc.id] ? "Replace File" : "Upload File"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-6 flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <Button onClick={onNext} size="lg" className="px-8">
          Next: Shipping <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function ShippingStep({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [method, setMethod] = React.useState<"pudo" | "manual">("pudo");

  return (
    <Card className="border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2 text-accent-primary">
          <Truck className="h-6 w-6" />
          <Badge variant="accent">Step 3</Badge>
        </div>
        <CardTitle className="text-3xl font-serif">Shipping Setup</CardTitle>
        <CardDescription>Tell us how you&apos;ll get your products to the Proe central hub or lockers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMethod("pudo")}
            className={cn(
              "p-6 rounded-card border-2 transition-all text-left flex flex-col gap-3",
              method === "pudo" ? "border-accent-primary bg-accent-primary/5" : "border-border hover:border-accent-primary/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              method === "pudo" ? "bg-accent-primary text-white" : "bg-bg-secondary text-text-muted"
            )}>
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">PUDO Account</h3>
              <p className="text-xs text-text-secondary mt-1">Connect your existing PUDO locker account for seamless waybill generation.</p>
            </div>
          </button>

          <button
            onClick={() => setMethod("manual")}
            className={cn(
              "p-6 rounded-card border-2 transition-all text-left flex flex-col gap-3",
              method === "manual" ? "border-accent-primary bg-accent-primary/5" : "border-border hover:border-accent-primary/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              method === "manual" ? "bg-accent-primary text-white" : "bg-bg-secondary text-text-muted"
            )}>
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Manual Address</h3>
              <p className="text-xs text-text-secondary mt-1">Provide a warehouse pickup address for our courier partners to collect from.</p>
            </div>
          </button>
        </div>

        {method === "pudo" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <Input label="PUDO Account Number" placeholder="e.g. PD-123456" />
            <p className="text-xs text-text-muted">You can find this in your PUDO app under 'My Profile'.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <Input label="Warehouse/Office Address" placeholder="Street, Building, Area, Code" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" placeholder="Johannesburg" />
              <Input label="Province" placeholder="Gauteng" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-6 flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <Button onClick={onNext} size="lg" className="px-8">
          Next: Preview <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function LaunchStep({ onComplete, onPrev, isLoading }: { onComplete: () => void, onPrev: () => void, isLoading: boolean }) {
  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <div className="bg-accent-primary h-32 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white translate-x-1/3 translate-y-1/3" />
        </div>
        <Sparkles className="h-12 w-12 text-white animate-bounce" />
      </div>
      <CardHeader className="text-center pt-8">
        <CardTitle className="text-3xl font-serif">You&apos;re ready to launch!</CardTitle>
        <CardDescription>Everything is set up. Here&apos;s a preview of how your brand will appear.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8">
        <div className="border border-border rounded-card overflow-hidden">
          <div className="p-6 flex items-center gap-6 bg-white">
            <div className="w-20 h-20 rounded-card bg-bg-secondary flex items-center justify-center shrink-0 border border-border">
              <Building2 className="h-10 w-10 text-text-muted" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-text-primary">Your Brand Name</h3>
                <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                </div>
              </div>
              <p className="text-sm text-text-secondary line-clamp-2">Your brand story will appear here, giving consumers a taste of what you&apos;ve all about.</p>
            </div>
          </div>
          <div className="px-6 py-4 bg-bg-secondary/30 flex items-center justify-between border-t border-border">
            <div className="flex gap-4">
              <Instagram className="h-4 w-4 text-text-muted" />
              <Facebook className="h-4 w-4 text-text-muted" />
            </div>
            <Badge variant="success">Verified Supplier</Badge>
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Ready to list your first freebie?</h4>
          <p className="text-xs text-text-secondary">You can launch your first campaign immediately after completing onboarding.</p>
        </div>
      </CardContent>
      <CardFooter className="pt-6 pb-10 flex flex-col gap-4 px-8">
        <Button onClick={onComplete} size="lg" className="w-full py-6 text-lg" isLoading={isLoading}>
          Complete Onboarding & Go to Dashboard
        </Button>
        <button
          type="button"
          onClick={onPrev}
          className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back and edit
        </button>
      </CardFooter>
    </Card>
  );
}
