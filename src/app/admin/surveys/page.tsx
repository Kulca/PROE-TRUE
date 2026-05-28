"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp } from "lucide-react";

const MOCK_SURVEYS = [
  { id: "1", campaign: "Summer Skincare Trial Kit", brand: "Glow Beauty", rating: 5, feedback: "Absolutely love this range! Will definitely purchase full size.", date: "2024-03-20" },
  { id: "2", campaign: "Chai Latte Blend", brand: "Spice Route Co.", rating: 4, feedback: "Great flavor, packaging could be better.", date: "2024-03-21" },
  { id: "3", campaign: "Mango Chutney Pack", brand: "Durban Flavours", rating: 5, feedback: "Perfect balance of sweet and tangy!", date: "2024-03-22" },
  { id: "4", campaign: "Biltong Spice Mix", brand: "Safari Spices", rating: 3, feedback: "Good product but shipping took too long.", date: "2024-03-23" },
  { id: "5", campaign: "Winter Beanie", brand: "JHB Knitwear", rating: 4, feedback: "Nice quality for the odd size.", date: "2024-03-24" },
];

export default function AdminSurveysPage() {
  const avgRating = (MOCK_SURVEYS.reduce((sum, s) => sum + s.rating, 0) / MOCK_SURVEYS.length).toFixed(1);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Survey Results</h1>
        <p className="text-text-secondary mt-1">Consumer feedback and ratings across all campaigns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Surveys", value: MOCK_SURVEYS.length },
          { label: "Average Rating", value: `${avgRating}/5` },
          { label: "Would Recommend", value: `${Math.round((MOCK_SURVEYS.filter((s) => s.rating >= 4).length / MOCK_SURVEYS.length) * 100)}%` },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-serif font-semibold text-text-primary">{value}</p>
              <p className="text-sm text-text-muted mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {MOCK_SURVEYS.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-text-primary">{s.campaign}</h3>
                    <span className="text-xs text-text-muted">· {s.brand}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">"{s.feedback}"</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < s.rating ? "text-warning fill-warning" : "text-border"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-1">{s.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
