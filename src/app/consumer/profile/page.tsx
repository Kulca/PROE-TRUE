"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockerFinder } from "@/components/consumer/locker-finder";
import { MapPin, User, Settings, Bell, Shield, Check, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const SIZES = ["XS", "S", "M", "L", "XL"];
const CATEGORIES = [
  { id: "new_launch", label: "New Launch" },
  { id: "clearance", label: "Clearance" },
  { id: "out_of_season", label: "Out of Season" },
  { id: "odd_sizing", label: "Odd Sizing" },
  { id: "closing_down", label: "Closing Down" },
];

const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
];

export default function ProfilePage() {
  const { toast } = useToast();
  
  // In a real app, we'd get the current user from auth
  // Mocking user fetching for now
  

  const [selectedLocker, setSelectedLocker] = React.useState<any>({
    id: "1",
    name: "Rosebank Mall",
    address: "15A Cradock Ave, Rosebank, Johannesburg",
    province: "Gauteng"
  });

  const [selectedSizes, setSelectedSizes] = React.useState<string[]>(["M", "L"]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(["new_launch", "clearance"]);
  const [selectedProvince, setSelectedProvince] = React.useState("Gauteng");
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true
  });

  const handleSaveLocker = async () => {
    try {
      //   preferred_pudo_locker_id: selectedLocker.id,
      //   pudo_locker_address: selectedLocker.address,
      // });
      toast("success", "Preferred PUDO locker updated.");
    } catch {
      toast("error", "Failed to update locker.");
    }
  };

  const handleSavePreferences = async () => {
    try {
      //   size_preferences: selectedSizes,
      //   category_interests: selectedCategories,
      //   notification_settings: notifications,
      // });
      toast("success", "Consumer preferences updated.");
    } catch {
      toast("error", "Failed to update preferences.");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast("success", "Profile settings saved.");
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="space-y-8 animate-page pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Profile & Preferences</h1>
        <p className="text-text-secondary">Manage your personal details, sizes, and interests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Account Settings */}
          <Card>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-5 w-5 text-accent-primary" />
                  <CardTitle>Account Details</CardTitle>
                </div>
                <CardDescription>Your basic information used for communications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue="Thabo Mokoena" required />
                  <Input label="Email Address" type="email" defaultValue="thabo@proe.co.za" required />
                </div>
                <Input label="Phone Number" type="tel" defaultValue="+27 82 123 4567" placeholder="+27 ..." />
              </CardContent>
              <CardFooter className="border-t border-border pt-6 flex justify-end">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Settings className="h-5 w-5 text-accent-primary" />
                <CardTitle>Consumer Preferences</CardTitle>
              </div>
              <CardDescription>Customize your discovery experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Size Preferences */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Size Preferences</h4>
                <div className="flex flex-wrap gap-3">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "h-12 w-12 rounded-card border flex items-center justify-center font-bold transition-all",
                        selectedSizes.includes(size)
                          ? "bg-accent-primary border-accent-primary text-white shadow-md scale-105"
                          : "bg-white border-border text-text-secondary hover:border-accent-primary/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-muted italic">Selecting your sizes helps us show you relevant fashion and footwear freebies.</p>
              </div>

              {/* Category Interests */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Interests</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-card border text-left transition-all",
                        selectedCategories.includes(cat.id)
                          ? "bg-accent-primary/5 border-accent-primary"
                          : "bg-white border-border hover:border-accent-primary/50"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        selectedCategories.includes(cat.id) ? "text-accent-primary" : "text-text-primary"
                      )}>
                        {cat.label}
                      </span>
                      {selectedCategories.includes(cat.id) && (
                        <Check className="h-4 w-4 text-accent-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6 flex justify-end">
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>

          {/* Locker Finder */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5 text-accent-primary" />
                <CardTitle>Preferred PUDO Locker</CardTitle>
              </div>
              <CardDescription>Select the locker where you&apos;d like to collect your free samples.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Province Filter</label>
                  <select 
                    className="w-full h-10 px-3 rounded-subtle border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {selectedLocker && (
                <div className="p-4 rounded-card bg-accent-primary/5 border border-accent-primary/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-accent-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary">{selectedLocker.name}</p>
                    <p className="text-xs text-text-secondary">{selectedLocker.address}</p>
                    <p className="text-[10px] text-accent-primary font-medium mt-1">{selectedLocker.province}</p>
                  </div>
                  <Badge variant="accent">Current Default</Badge>
                </div>
              )}
              
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-text-primary">Find a new locker</p>
                <LockerFinder 
                  selectedId={selectedLocker?.id} 
                  onSelect={(locker) => setSelectedLocker(locker)} 
                  province={selectedProvince}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6 flex justify-end">
              <Button onClick={handleSaveLocker} variant="secondary">Update Preferred Locker</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Bell className="h-5 w-5 text-accent-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Stay updated on new freebies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "email", icon: Mail, label: "Email Notifications", desc: "Weekly roundup and claim updates" },
                { id: "sms", icon: MessageSquare, label: "SMS Alerts", desc: "Immediate pickup PIN codes" },
                { id: "push", icon: Smartphone, label: "Push Notifications", desc: "New campaigns in your area" },
              ].map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-card hover:bg-bg-secondary transition-colors">
                  <div className="mt-1">
                    <item.icon className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                    className={cn(
                      "w-10 h-6 rounded-full relative transition-colors shrink-0 mt-1",
                      notifications[item.id as keyof typeof notifications] ? "bg-accent-primary" : "bg-border"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      notifications[item.id as keyof typeof notifications] ? "left-5" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { icon: Shield, label: "Two-Factor Auth", status: "Disabled" },
                { icon: Settings, label: "Language", status: "English" },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-card hover:bg-bg-secondary transition-colors group">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                    <span className="text-sm text-text-primary">{item.label}</span>
                  </div>
                  <span className="text-xs text-text-muted">{item.status}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-accent-secondary text-white border-none">
            <CardHeader>
              <CardTitle className="text-white">Need help?</CardTitle>
              <CardDescription className="text-white/70">Our support team is here for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                If you have issues with a PUDO locker or a specific sample, please reach out via our support channel.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
