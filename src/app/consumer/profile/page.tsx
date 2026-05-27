"use client";
import { useState } from "react";
import { MapPin, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SA_PROVINCES } from "@/lib/utils";

const LOCKERS = [
  { id: "1", name: "Sandton City", address: "Shop 23, Lower Ground, Sandton City, 2196", province: "Gauteng", lat: -26.1076, lng: 28.0567 },
  { id: "2", name: "Rosebank Mall", address: "Unit 12, Rosebank Mall, 51 Bath Avenue, Rosebank", province: "Gauteng", lat: -26.1455, lng: 28.0403 },
  { id: "3", name: "Gateway Theatre", address: "Shop 8, Gateway Theatre, 2 KwaMashu Highway, Durban", province: "KwaZulu-Natal", lat: -29.7845, lng: 30.9982 },
  { id: "4", name: "Canal Walk", address: "Centre Management, Canal Walk Shopping Centre, Century City", province: "Western Cape", lat: -33.8299, lng: 18.5145 },
  { id: "5", name: "Menlyn Park", address: "Shop 212, Menlyn Park Shopping Centre, Atterbury Road, Menlyn", province: "Gauteng", lat: -25.7835, lng: 28.2758 },
];

export default function ProfilePage() {
  const [province, setProvince] = useState<string | null>(null);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const filteredLockers = province ? LOCKERS.filter((l) => l.province === province) : LOCKERS;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Profile</h1>
        <p className="text-text-secondary">Manage your account and preferred collection point.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <Card className="p-5">
          <h2 className="font-serif text-xl mb-4">Account Details</h2>
          <div className="space-y-3">
            <Input label="Full Name" defaultValue="Jane Tester" />
            <Input label="Email" defaultValue="jane@example.com" type="email" />
            <Input label="Phone" defaultValue="+27 82 123 4567" />
            <Button className="w-full mt-2">Update Profile</Button>
          </div>
        </Card>

        {/* Preferred PUDO Locker */}
        <Card className="p-5">
          <h2 className="font-serif text-xl mb-1">Preferred PUDO Locker</h2>
          <p className="text-sm text-text-secondary mb-4">Used as default for all your claims.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {SA_PROVINCES.map((p) => (
              <button
                key={p}
                onClick={() => setProvince(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${province === p ? "bg-accent-primary text-white" : "bg-bg-secondary text-text-secondary hover:bg-border"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredLockers.map((locker) => (
              <button
                key={locker.id}
                onClick={() => setSelectedLocker(locker.id)}
                className={`w-full text-left p-3 rounded border transition-all ${selectedLocker === locker.id ? "border-accent-primary bg-accent-primary/5" : "border-border hover:border-accent-primary/50"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{locker.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{locker.address}</p>
                  </div>
                  {selectedLocker === locker.id && <Check className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />}
                </div>
              </button>
            ))}
          </div>
          {selectedLocker && (
            <Button onClick={handleSave} className="w-full mt-3" variant={saved ? "secondary" : "primary"}>
              {saved ? "Saved ✓" : "Save Preferred Locker"}
            </Button>
          )}
        </Card>
      </div>
    </main>
  );
}