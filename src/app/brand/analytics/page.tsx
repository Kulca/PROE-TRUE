"use client";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const FEEDBACK = [
  { id: "1", product: "Rooibos Ice Tea", rating: 5, text: "Absolutely delicious! Will definitely buy again.", user: "Thandi M.", date: "2 days ago" },
  { id: "2", product: "Chai Latte Blend", rating: 4, text: "Great flavour, a bit sweet for my taste but overall lovely.", user: "Johan K.", date: "3 days ago" },
  { id: "3", product: "Winter Beanie", rating: 5, text: "Perfect fit and warm! The stitching issue is barely noticeable.", user: "Lisa N.", date: "1 week ago" },
];

export default function AnalyticsPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Analytics</h1>
        <p className="text-text-secondary">See how your campaigns and products are performing.</p>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Claims Over Time", value: "Mar: 412 → Apr: 583 → May: 721" },
          { label: "By Category", value: "New Launch: 45% | Clearance: 30% | Other: 25%" },
          { label: "Survey Sentiment", value: "Positive: 78% | Neutral: 18% | Negative: 4%" },
        ].map((chart) => (
          <Card key={chart.label} className="p-5">
            <p className="text-xs text-text-muted mb-3">{chart.label}</p>
            <div className="h-20 bg-bg-secondary rounded flex items-center justify-center">
              <span className="text-sm text-text-secondary">{chart.value}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Feedback Feed */}
      <Card className="p-5">
        <h2 className="font-serif text-xl mb-4">Recent Feedback</h2>
        <div className="space-y-4">
          {FEEDBACK.map((f) => (
            <div key={f.id} className="p-4 bg-bg-secondary rounded">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{f.product}</p>
                  <p className="text-xs text-text-muted">{f.user} · {f.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= f.rating ? "fill-warning text-warning" : "text-border"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-text-secondary">{f.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}