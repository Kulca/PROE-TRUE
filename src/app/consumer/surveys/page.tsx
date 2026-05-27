"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PENDING_SURVEYS = [
  { id: "1", claimId: "4", title: "Winter Beanie", brand: "JHB Knitwear", collectedAt: "1 week ago" },
];

export default function SurveysPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (surveyId: string) => {
    if (rating === 0) return;
    setSubmitted(surveyId);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Surveys</h1>
        <p className="text-text-secondary">Rate your collected samples to unlock new claims.</p>
      </div>

      {PENDING_SURVEYS.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted">No pending surveys. Collect more freebies to earn survey slots!</p>
        </div>
      )}

      <div className="space-y-6">
        {PENDING_SURVEYS.map((survey) => (
          <Card key={survey.id} className="p-5">
            {submitted !== survey.id ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg mb-1">{survey.title}</h3>
                  <p className="text-sm text-text-secondary">{survey.brand} · Collected {survey.collectedAt}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">How would you rate this product?</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={cn(
                            "w-7 h-7 transition-colors",
                            (hover || rating) >= star ? "fill-warning text-warning" : "text-border"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  as="textarea"
                  placeholder="Share your thoughts (optional)"
                  value={feedback}
                  onChange={(e: any) => setFeedback(e.target.value)}
                  className="min-h-24 resize-none"
                />
                <Button
                  onClick={() => handleSubmit(survey.id)}
                  disabled={rating === 0}
                  className="w-full"
                >
                  Submit Survey
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-7 h-7 fill-warning text-warning" />
                </div>
                <h3 className="font-serif text-lg mb-1">Survey Submitted!</h3>
                <p className="text-sm text-text-secondary">Thanks for your feedback. You can now claim new freebies.</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}