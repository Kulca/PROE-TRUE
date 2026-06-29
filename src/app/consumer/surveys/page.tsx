"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ClipboardCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function SurveysPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const pendingSurveys = useQuery(
    api.surveys.pendingByUser,
    userId ? { user_id: userId } : "skip"
  );
  const submitSurvey = useMutation(api.surveys.submit);

  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeSurvey, setActiveSurvey] = React.useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast("error", "Please select a rating.");
      return;
    }
    if (!userId || !activeSurvey) return;

    setIsSubmitting(true);
    try {
      await submitSurvey({
        campaign_id: activeSurvey.claim.campaign_id,
        user_id: userId,
        claim_id: activeSurvey.claim._id,
        ratings: rating,
        written_feedback: feedback || undefined,
      });
      toast("success", "Thank you for your feedback! Your next claim is now unlocked.");
      setActiveSurvey(null);
      setRating(0);
      setFeedback("");
    } catch (err: any) {
      toast("error", err.message ?? "Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const surveysList = React.useMemo(() => {
    if (!pendingSurveys) return [];
    return pendingSurveys.map((item: any) => ({
      id: item.claim._id,
      title: item.campaign?.title ?? "Unknown",
      brand: item.campaign?.brand_name ?? "Brand",
      collectedAt: item.claim.createdAt
        ? new Date(item.claim.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
        : "Unknown",
      image: item.campaign?.image_url ?? undefined,
      claim: item.claim,
    }));
  }, [pendingSurveys]);

  if (!userId) {
    return (
      <div className="space-y-8 animate-page">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-text-primary">Pending Surveys</h1>
          <p className="text-text-secondary">Please sign in to view your surveys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Pending Surveys</h1>
        <p className="text-text-secondary">Share your thoughts on the samples you&apos;ve received.</p>
      </div>

      {surveysList.length > 0 && !activeSurvey ? (
        <div className="grid grid-cols-1 gap-6">
          {surveysList.map((survey: any) => (
            <Card key={survey.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-card overflow-hidden shrink-0 bg-bg-secondary">
                    {survey.image ? (
                      <img src={survey.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary">{survey.title}</h3>
                    <p className="text-sm text-text-muted">Brand: {survey.brand}</p>
                    <p className="text-xs text-text-muted mt-1">Collected on {survey.collectedAt}</p>
                  </div>
                  <Button onClick={() => setActiveSurvey(survey)}>
                    Start Survey
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeSurvey ? (
        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-card overflow-hidden">
                    {activeSurvey.image ? (
                      <img src={activeSurvey.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">Review: {activeSurvey.title}</CardTitle>
                    <CardDescription>By {activeSurvey.brand}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4 text-center">
                  <p className="text-sm font-medium text-text-primary">How would you rate this sample?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 transition-transform active:scale-95"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={cn(
                            "h-10 w-10 transition-colors",
                            (hoverRating || rating) >= star
                              ? "fill-warning text-warning"
                              : "text-border"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">
                    Any specific feedback? (Optional)
                  </label>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-subtle border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-all"
                    placeholder="What did you like? What could be improved?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border pt-6">
                <Button variant="ghost" onClick={() => { setActiveSurvey(null); setRating(0); setFeedback(""); }}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting}>Submit Review</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      ) : pendingSurveys === undefined ? (
        <div className="text-center py-20">
          <p className="text-text-muted">Loading surveys...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <ClipboardCheck className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-lg font-serif text-text-primary mb-1">All caught up!</h3>
          <p className="text-sm text-text-secondary">You have no pending surveys. Go discover more freebies!</p>
          <Link href="/consumer/marketplace" className="mt-6">
            <Button variant="primary">Explore Marketplace</Button>
          </Link>
        </div>
      )}
    </div>
  );
}