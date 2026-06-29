"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Package, ShieldCheck, Star } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import BillboardCarousel from "@/components/shared/billboard-carousel";

type FilterTab = "all" | "verified" | "featured";

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "verified", label: "Verified Brands" },
  { key: "featured", label: "Featured" },
];

const CATEGORY_LABELS: Record<string, string> = {
  new_launch: "New Launch",
  clearance: "Clearance",
  out_of_season: "Out of Season",
  odd_sizing: "Odd Sizing",
  closing_down: "Closing Down",
};

interface Locker {
  _id: string;
  name: string;
  address: string;
  province: string;
}

export default function MarketplacePage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const campaigns = useQuery(api.campaigns.list, {}) ?? [];
  const billboardSlides = useQuery(api.admin.listBillboardCampaigns, {}) ?? [];
  const lockers = useQuery(api.pudo.listLockers, {}) ?? [];
  const createClaim = useMutation(api.claims.create);

  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);
  const [isClaiming, setIsClaiming] = React.useState(false);
  const [filterTab, setFilterTab] = React.useState<FilterTab>("all");
  const [search, setSearch] = React.useState("");
  const [selectedLockerId, setSelectedLockerId] = React.useState<string>("");
  const [showLockerPicker, setShowLockerPicker] = React.useState(false);

  const filtered = React.useMemo(() => {
    return campaigns.filter((c: any) => {
      if (filterTab === "featured" && !c.is_featured) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, filterTab, search]);

  const heroBillboard = React.useMemo(() => {
    return billboardSlides.map((c: any) => ({
      id: c._id,
      campaign_title: c.title,
      brand_name: "Featured Brand",
      campaign_story: c.campaign_story ?? "",
      category: CATEGORY_LABELS[c.category] ?? c.category,
    }));
  }, [billboardSlides]);

  const handleClaim = async () => {
    if (!selectedCampaign || !userId) {
      toast("error", "Please sign in to claim a sample.");
      return;
    }
    if (!selectedLockerId) {
      toast("error", "Please select a PUDO locker for pickup.");
      return;
    }
    setIsClaiming(true);
    try {
      await createClaim({
        user_id: userId,
        campaign_id: selectedCampaign._id,
        selected_locker_id: selectedLockerId,
        agree_to_survey_lock: true,
      });
      toast("success", "Sample claimed successfully! Check My Claims for details.");
      setSelectedCampaign(null);
      setSelectedLockerId("");
    } catch (err: any) {
      toast("error", err.message ?? "Failed to claim sample. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const selectedLocker = lockers.find((l: any) => l._id === selectedLockerId) as Locker | undefined;

  const groupLockersByProvince = React.useMemo(() => {
    const groups: Record<string, Locker[]> = {};
    for (const l of lockers as Locker[]) {
      if (!groups[l.province]) groups[l.province] = [];
      groups[l.province].push(l);
    }
    return groups;
  }, [lockers]);

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Freebie Marketplace</h1>
        <p className="text-text-secondary">Discover and claim free samples from your favourite South African brands.</p>
      </div>

      {/* Hero Billboard Carousel */}
      {heroBillboard.length > 0 && (
        <BillboardCarousel slides={heroBillboard} size="hero" autoRotate autoRotateInterval={6000} />
      )}

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-sm border-b border-border py-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterTab(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterTab === key
                    ? "bg-accent-primary text-white"
                    : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Search freebies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
      </div>

      {/* Mid Billboard Carousel */}
      {heroBillboard.length > 0 && filterTab === "all" && (
        <BillboardCarousel slides={heroBillboard} size="mid" autoRotate autoRotateInterval={8000} />
      )}

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((campaign: any) => (
          <Card key={campaign._id} className="group cursor-pointer overflow-hidden flex flex-col h-full" onClick={() => setSelectedCampaign(campaign)}>
            <div className="aspect-[3/2] overflow-hidden bg-bg-secondary relative">
              {campaign.image_url ? (
                <img
                  src={campaign.image_url}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                  No image
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="accent">{CATEGORY_LABELS[campaign.category] ?? campaign.category}</Badge>
                {campaign.is_featured && <Badge variant="warning"><Star className="h-3 w-3 mr-0.5" />Featured</Badge>}
              </div>
            </div>
            <CardContent className="p-4 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-accent-secondary uppercase tracking-wider">
                  Brand
                </p>
                <h3 className="text-lg font-serif text-text-primary leading-tight line-clamp-2">{campaign.title}</h3>
              </div>
              <p className="text-sm text-text-secondary line-clamp-2 mt-2">{campaign.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Package className="h-3.5 w-3.5" />
                  <span>Size {campaign.pudo_box_size_required}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>{campaign.inventory_count} left</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="primary" className="w-full" onClick={(e) => { e.stopPropagation(); setSelectedCampaign(campaign); }}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="font-serif text-xl text-text-muted">No freebies match your filter</p>
          <Button variant="secondary" onClick={() => setFilterTab("all")}>Show all freebies</Button>
        </div>
      )}

      {/* Footer Billboard */}
      {heroBillboard.length > 0 && filterTab === "all" && (
        <BillboardCarousel slides={heroBillboard} size="footer" autoRotate={false} />
      )}

      {/* Claim Modal */}
      <Modal isOpen={!!selectedCampaign} onClose={() => { setSelectedCampaign(null); setShowLockerPicker(false); }} title="Claim Sample">
        {selectedCampaign && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-card overflow-hidden shrink-0 bg-bg-secondary">
                {selectedCampaign.image_url ? (
                  <img src={selectedCampaign.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-lg leading-tight">{selectedCampaign.title}</h4>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{CATEGORY_LABELS[selectedCampaign.category] ?? selectedCampaign.category}</Badge>
                  <Badge variant="outline">{selectedCampaign.pudo_box_size_required}</Badge>
                  {selectedCampaign.is_featured && <Badge variant="warning"><Star className="h-3 w-3 mr-0.5" />Featured</Badge>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary">About this sample</p>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedCampaign.description}</p>
            </div>

            {/* Locker Selection */}
            <div className="p-4 rounded-card bg-bg-secondary border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pickup Location</span>
                <button
                  onClick={() => setShowLockerPicker(!showLockerPicker)}
                  className="text-xs text-accent-primary font-medium hover:underline"
                >
                  {selectedLocker ? "Change" : "Select"}
                </button>
              </div>
              {selectedLocker ? (
                <div className="flex items-start gap-3 text-text-secondary">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent-primary" />
                  <div className="text-xs">
                    <p className="font-medium text-text-primary">{selectedLocker.name}</p>
                    <p>{selectedLocker.address}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted">Select a PUDO locker near you</p>
              )}

              {showLockerPicker && (
                <div className="max-h-48 overflow-y-auto space-y-1 border-t border-border pt-3">
                  {Object.entries(groupLockersByProvince).map(([province, lockerList]) => (
                    <div key={province}>
                      <p className="text-[10px] font-bold uppercase text-text-muted tracking-wider mb-1 px-1">{province}</p>
                      {lockerList.map((locker) => (
                        <button
                          key={locker._id}
                          onClick={() => { setSelectedLockerId(locker._id); setShowLockerPicker(false); }}
                          className={`w-full text-left px-3 py-2 rounded-subtle text-xs transition-colors ${
                            selectedLockerId === locker._id
                              ? "bg-accent-primary/10 text-accent-primary"
                              : "hover:bg-bg-primary text-text-secondary"
                          }`}
                        >
                          <span className="font-medium">{locker.name}</span>
                          <span className="text-text-muted ml-1">— {locker.address}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-text-muted italic">
                By claiming this sample, you agree to complete a short survey within 48 hours of collection. Subsequent claims will be locked until the survey is submitted.
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={handleClaim}
                isLoading={isClaiming}
                disabled={!selectedLockerId || !userId}
              >
                {!userId ? "Sign in to Claim" : !selectedLockerId ? "Select a Locker" : "Confirm Claim"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}