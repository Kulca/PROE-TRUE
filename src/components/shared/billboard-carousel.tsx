"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillboardSlide {
  id: string;
  campaign_title: string;
  brand_name: string;
  campaign_story: string;
  image_url?: string;
  category: string;
}

interface Props {
  slides: BillboardSlide[];
  autoRotate?: boolean;
  autoRotateInterval?: number;
  size?: "hero" | "mid" | "footer";
}

const SIZE_CLASSES = {
  hero: "h-[420px]",
  mid: "h-[280px]",
  footer: "h-[200px]",
};

export default function BillboardCarousel({
  slides,
  autoRotate = true,
  autoRotateInterval = 5000,
  size = "hero",
}: Props) {
  const [current, setCurrent] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (!autoRotate || slides.length <= 1) return;
    const timer = setInterval(() => goNext(), autoRotateInterval);
    return () => clearInterval(timer);
  }, [current, autoRotate, slides.length, autoRotateInterval]);

  const goNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((c) => (c + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const goPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  if (!slides.length) return null;

  const slide = slides[current];
  const bgGradient = "bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary";

  return (
    <div className={`relative rounded-card overflow-hidden ${SIZE_CLASSES[size]}`}>
      <Card className={`w-full h-full border-0 rounded-none ${bgGradient}`}>
        <CardContent className="p-8 md:p-12 h-full flex flex-col justify-center items-center text-center relative">
          {/* Background accent */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-accent-primary),transparent_70%)]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <p className="text-xs font-medium text-accent-primary uppercase tracking-[0.2em]">
              {slide.category.replace(/_/g, " ")}
            </p>
            <h2 className={`font-serif text-text-primary leading-tight ${
              size === "hero" ? "text-4xl md:text-5xl" : size === "mid" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
            }`}>
              {slide.campaign_title}
            </h2>
            <p className="text-sm text-accent-secondary font-medium tracking-wider uppercase">
              {slide.brand_name}
            </p>
            {slide.campaign_story && (
              <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto line-clamp-3">
                {slide.campaign_story}
              </p>
            )}
            {size !== "footer" && (
              <Button variant="primary" size="lg" className="mt-2">
                View Campaign
              </Button>
            )}
          </div>

          {/* Navigation arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bg-secondary/80 backdrop-blur border border-border flex items-center justify-center hover:bg-bg-tertiary transition-colors z-10"
              >
                <ChevronLeft className="h-5 w-5 text-text-secondary" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bg-secondary/80 backdrop-blur border border-border flex items-center justify-center hover:bg-bg-tertiary transition-colors z-10"
              >
                <ChevronRight className="h-5 w-5 text-text-secondary" />
              </button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setIsTransitioning(true); setTimeout(() => setIsTransitioning(false), 400); }}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-accent-primary" : "w-1.5 bg-text-muted/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
