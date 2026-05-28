"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MapPin, 
  Package, 
  LogIn,
  ShieldCheck,
  Star
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { BillboardCarousel } from "@/components/shared/billboard-carousel";

export default function MarketplacePage() {
  const { toast } = useToast();
  const router = useRouter();
  const campaigns = useQuery(api.campaigns.listActive);
  
  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);
  const [isClaiming, setIsClaiming] = React.useState(false);
  const [isGuest, setIsGuest] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "verified" | "featured">("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const guestData = localStorage.getItem("proe-guest");
    if (guestData) {
      setIsGuest(true);
    }
  }, []);

  const handleClaim = () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setSelectedCampaign(null);
      toast({
        title: "Sample Claimed!",
        description: "Check your email for the PUDO collection pin.",
        variant: "success",
      });
    }, 1500);
  };

  const filteredCampaigns = campaigns?.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.brand?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "verified") return matchesSearch && c.brand?.is_verified;
    if (filter === "featured") return matchesSearch && c.featured;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-page pb-20">
      <BillboardCarousel placement="hero" className="mb-8" />
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-md py-4 border-b border-border -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="relative flex-1 max-w-xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by brand or product..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-1 bg-bg-card border border-border rounded-full p-1 w-full md:w-auto">
          {[
            { id: "all", label: "All" },
            { id: "verified", label: "Verified", icon: ShieldCheck },
            { id: "featured", label: "Featured", icon: Star },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id as any)}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all",
                filter === option.id 
                  ? "bg-accent-primary text-white shadow-sm" 
                  : "text-text-secondary hover:bg-bg-secondary"
              )}
            >
              {option.icon && <option.icon className="h-3 w-3" />}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!campaigns ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/3] bg-bg-secondary rounded-card" />
              <div className="h-4 w-2/3 bg-bg-secondary rounded" />
              <div className="h-3 w-1/2 bg-bg-secondary rounded" />
            </div>
          ))
        ) : filteredCampaigns?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Package className="h-12 w-12 text-border mx-auto mb-4 opacity-20" />
            <p className="text-text-secondary italic underline decoration-accent-primary decoration-2 underline-offset-4">No samples found for this filter.</p>
          </div>
        ) : (
          <>
            {filteredCampaigns?.slice(0, 3).map((campaign) => (
              <Card 
                key={campaign._id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="aspect-[4/3] bg-bg-secondary relative overflow-hidden">
                  {campaign.image_url ? (
                    <img 
                      src={campaign.image_url} 
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted opacity-20">
                      <Package className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 backdrop-blur-md text-text-primary border-none text-[10px] uppercase font-bold tracking-tight">
                      {campaign.category.replace("_", " ")}
                    </Badge>
                    {campaign.featured && (
                      <Badge className="bg-accent-primary text-white border-none text-[10px] gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" /> Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1.5 mb-1 text-xs text-accent-primary font-medium">
                    {campaign.brand?.name}
                    {campaign.brand?.is_verified && (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight line-clamp-1">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Package className="h-3.5 w-3.5" />
                      <span>Size {campaign.pudo_box_size_required}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Multiple Locations</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button variant="outline" className="w-full group-hover:bg-accent-primary group-hover:text-white group-hover:border-accent-primary transition-all duration-300">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredCampaigns && filteredCampaigns.length > 3 && (
              <div className="col-span-full py-8">
                <BillboardCarousel placement="brand" />
              </div>
            )}

            {filteredCampaigns?.slice(3).map((campaign) => (
              <Card 
                key={campaign._id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="aspect-[4/3] bg-bg-secondary relative overflow-hidden">
                  {campaign.image_url ? (
                    <img 
                      src={campaign.image_url} 
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted opacity-20">
                      <Package className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 backdrop-blur-md text-text-primary border-none text-[10px] uppercase font-bold tracking-tight">
                      {campaign.category.replace("_", " ")}
                    </Badge>
                    {campaign.featured && (
                      <Badge className="bg-accent-primary text-white border-none text-[10px] gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" /> Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1.5 mb-1 text-xs text-accent-primary font-medium">
                    {campaign.brand?.name}
                    {campaign.brand?.is_verified && (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight line-clamp-1">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Package className="h-3.5 w-3.5" />
                      <span>Size {campaign.pudo_box_size_required}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Multiple Locations</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button variant="outline" className="w-full group-hover:bg-accent-primary group-hover:text-white group-hover:border-accent-primary transition-all duration-300">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>

      <BillboardCarousel placement="footer" className="mt-12" />

      {/* Claim Modal */}
      <Modal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title="Claim Sample"
      >
        {selectedCampaign && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-card overflow-hidden shrink-0 bg-bg-secondary">
                {selectedCampaign.image_url ? (
                  <img src={selectedCampaign.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-accent-primary font-medium">
                  {selectedCampaign.brand?.name}
                  {selectedCampaign.brand?.is_verified && (
                    <ShieldCheck className="h-3 w-3" />
                  )}
                </div>
                <h4 className="font-serif text-xl leading-tight font-bold mt-1">{selectedCampaign.title}</h4>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="text-[10px] uppercase">{selectedCampaign.category.replace("_", " ")}</Badge>
                  <Badge variant="outline" className="text-[10px]">SIZE {selectedCampaign.pudo_box_size_required}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-text-primary">About this sample</p>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedCampaign.description}</p>
            </div>

            {selectedCampaign.story && (
              <div className="p-4 rounded-card bg-accent-primary/5 border border-accent-primary/10 italic text-sm text-accent-primary leading-relaxed">
                "{selectedCampaign.story}"
              </div>
            )}

            <div className="p-4 rounded-card bg-bg-secondary border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pickup Location</span>
                <span className="text-xs text-accent-primary font-medium cursor-pointer hover:underline">Change</span>
              </div>
              <div className="flex items-start gap-3 text-text-secondary">
                <MapPin className="h-4 w-4 mt-0.5 text-accent-primary" />
                <div className="text-xs">
                  <p className="font-bold text-text-primary">PUDO Locker: Rosebank Mall</p>
                  <p>15A Cradock Ave, Rosebank, Johannesburg, 2196</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-text-muted italic leading-tight">
                By claiming this sample, you agree to complete a short survey within 48 hours of collection. Subsequent claims will be locked until the survey is submitted.
              </p>
              <Button className="w-full" size="lg" onClick={handleClaim} isLoading={isClaiming}>
                Confirm Claim
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Auth Modal for Guests */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to continue"
      >
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto text-accent-primary">
            <LogIn className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold">Tasting is better with friends</h3>
            <p className="text-sm text-text-secondary">You need a Proe account to claim samples and track your orders.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="secondary" onClick={() => router.push("/login")}>Login</Button>
            <Button onClick={() => router.push("/register")}>Create Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
