"use client";
import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/convex/_generated/api";
import { Building2, Shield, Zap, Save, Loader2 } from "lucide-react";

const INDUSTRIES = [
  "Fashion & Apparel",
  "Beauty & Cosmetics",
  "Food & Beverage",
  "Health & Wellness",
  "Home & Living",
  "Electronics",
  "Sports & Outdoors",
  "Other",
];

export default function BrandProfilePage() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const updatePreferences = useMutation(api.auth.updatePreferences);

  const [saving, setSaving] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [facebook, setFacebook] = React.useState("");
  const [twitter, setTwitter] = React.useState("");

  React.useEffect(() => {
    if (user) {
      const bd = (user as any).brand_details;
      setCompanyName(bd?.company_name || "");
      setDescription(bd?.description || "");
      setIndustry(bd?.industry || "");
      setInstagram(bd?.social_links?.instagram || "");
      setFacebook(bd?.social_links?.facebook || "");
      setTwitter(bd?.social_links?.twitter || "");
      setPhone((user as any).phone_number || "");
    }
  }, [user]);

  const handleAvatarUpload = (storageId: string) => {
    toast("success", "Avatar updated successfully.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setSaving(true);
    try {
      await updatePreferences({
        user_id: user._id as any,
        phone_number: phone,
        brand_details: {
          company_name: companyName,
          description,
          industry,
          social_links: {
            instagram: instagram || undefined,
            facebook: facebook || undefined,
            twitter: twitter || undefined,
          },
        },
      });
      toast("success", "Profile updated successfully.");
    } catch (err: any) {
      toast("error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  const isPremium = false; // Will be wired with subscription query
  const verificationStatus = (user as any)?.verification_docs?.status || "unverified";

  return (
    <div className="space-y-8 animate-page pb-12">
      <div>
        <h1 className="text-2xl font-serif font-bold text-text-primary">Brand Profile</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your brand account and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-5 w-5 text-accent-primary" />
                <CardTitle>Company Details</CardTitle>
              </div>
              <CardDescription>Update your brand information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4">
                <Input
                  label="Company Name"
                  placeholder="Your brand name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    hint="Email cannot be changed"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">Description</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-card border border-border bg-bg-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors resize-none"
                    rows={3}
                    placeholder="Tell us about your brand..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">Industry</label>
                  <select
                    className="w-full px-3 py-2 rounded-card border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-6 flex justify-end">
                <Button type="submit" isLoading={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-5 w-5 text-accent-primary" />
                <CardTitle>Social Links</CardTitle>
              </div>
              <CardDescription>Connect your social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Instagram"
                placeholder="https://instagram.com/yourbrand"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
              <Input
                label="Facebook"
                placeholder="https://facebook.com/yourbrand"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
              <Input
                label="Twitter / X"
                placeholder="https://twitter.com/yourbrand"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Brand Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <AvatarUpload
                currentStorageId={(user as any)?.avatar_storage_id}
                onUploadComplete={handleAvatarUpload}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Verification</span>
                <Badge variant={verificationStatus === "verified" ? "default" : "secondary"}>
                  {verificationStatus === "verified" ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Plan</span>
                <Badge className="bg-slate-100 text-slate-700 border-slate-300">Free</Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button variant="secondary" className="w-full" asChild>
                <a href="/brand/billing">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}