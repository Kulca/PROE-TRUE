"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function AdminSurveysPage() {
  const surveys = useQuery(api.admin.listAllSurveys, {}) ?? [];

  const avgRating = surveys.length > 0
    ? (surveys.reduce((sum: number, s: any) => sum + s.ratings, 0) / surveys.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Survey Results</h1>
        <p className="text-text-secondary mt-1">Consumer feedback and ratings across all campaigns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Surveys", value: surveys.length },
          { label: "Average Rating", value: `${avgRating}/5` },
          { label: "High Ratings (4+)", value: surveys.length > 0 ? `${Math.round((surveys.filter((s: any) => s.ratings >= 4).length / surveys.length) * 100)}%` : "0%" },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-serif font-semibold text-text-primary">{value}</p>
              <p className="text-sm text-text-muted mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {surveys.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted">No surveys yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {surveys.map((s: any) => (
          <Card key={s._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-text-primary">Campaign Feedback</h3>
                    <span className="text-xs text-text-muted">· {new Date(s.submitted_at).toLocaleDateString("en-ZA")}</span>
                  </div>
                  {s.written_feedback && (
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">"{s.written_feedback}"</p>
                  )}
                  {!s.written_feedback && (
                    <p className="text-sm text-text-muted mt-2 italic">No written feedback</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < s.ratings ? "text-warning fill-warning" : "text-border"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}