"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Quote } from "lucide-react";

export default function AdminSurveysPage() {
  const surveys = useQuery(api.admin.getAllSurveys);

  return (
    <div className="space-y-8 animate-page">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Consumer Feedback</h1>
        <p className="text-text-secondary mt-1">Review all submitted surveys and product ratings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!surveys ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-32 bg-bg-secondary/20" />
          ))
        ) : surveys.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text-muted italic">No surveys submitted yet.</div>
        ) : (
          surveys.map((survey) => (
            <Card key={survey._id} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < survey.ratings ? "text-warning fill-current" : "text-border"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-text-muted">{new Date(survey.submitted_at).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {survey.written_feedback && (
                  <div className="relative">
                    <Quote className="absolute -left-2 -top-2 h-8 w-8 text-accent-primary/5 -z-0" />
                    <p className="text-sm text-text-primary italic relative z-10 pl-4 border-l-2 border-accent-primary/20">
                      {survey.written_feedback}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <MessageSquare className="h-3 w-3" />
                  <span>Survey for claim {survey.claim_id.substring(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
