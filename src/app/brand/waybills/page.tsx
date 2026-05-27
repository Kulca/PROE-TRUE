"use client";
import { useState } from "react";
import { Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PUDO_BOX_PRICES, BOX_SIZES } from "@/lib/utils";

type WaybillType = "bulk" | "individual";

export default function WaybillsPage() {
  const [type, setType] = useState<WaybillType>("bulk");
  const [boxes, setBoxes] = useState({ xs: 0, s: 0, m: 0, l: 0, xl: 1 });
  const [zone, setZone] = useState<"JHB" | "CPT" | "DBN">("JHB");
  const [generated, setGenerated] = useState(false);

  const zoneMultipliers = { JHB: 1.0, CPT: 1.2, DBN: 1.1 };
  const totalPrice = Object.entries(boxes).reduce((sum, [size, qty]) => {
    return sum + (PUDO_BOX_PRICES[size as keyof typeof PUDO_BOX_PRICES] * qty * zoneMultipliers[zone]);
  }, 0);

  const handlePrint = () => setGenerated(true);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">PUDO Waybills</h1>
        <p className="text-text-secondary">Generate shipping labels for your inventory.</p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setType("bulk")}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${type === "bulk" ? "bg-accent-secondary text-white" : "bg-bg-secondary text-text-secondary"}`}
        >
          Bulk Hub Shipment
        </button>
        <button
          onClick={() => setType("individual")}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${type === "individual" ? "bg-accent-secondary text-white" : "bg-bg-secondary text-text-secondary"}`}
        >
          Individual Labels
        </button>
      </div>

      {type === "bulk" ? (
        <Card className="p-5 space-y-6">
          <div>
            <h2 className="font-serif text-xl mb-4">Box Quantities</h2>
            <div className="grid grid-cols-5 gap-3">
              {(Object.keys(BOX_SIZES) as Array<keyof typeof BOX_SIZES>).map((size) => (
                <div key={size} className="text-center">
                  <p className="text-xs text-text-muted mb-1">{size}</p>
                  <p className="text-xs text-text-secondary mb-2">{PUDO_BOX_PRICES[size]} ZAR</p>
                  <Input
                    type="number"
                    min="0"
                    value={boxes[size.toLowerCase() as keyof typeof boxes]}
                    onChange={(e) => setBoxes({ ...boxes, [size.toLowerCase()]: parseInt(e.target.value) || 0 })}
                    className="text-center"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary font-medium block mb-2">Hub Zone</label>
            <div className="flex gap-3">
              {(["JHB", "CPT", "DBN"] as const).map((z) => (
                <button key={z} onClick={() => setZone(z)} className={`px-4 py-2 rounded border text-sm ${zone === z ? "border-accent-secondary bg-accent-secondary/5 text-accent-secondary" : "border-border text-text-secondary"}`}>
                  {z === "JHB" ? "Johannesburg" : z === "CPT" ? "Cape Town" : "Durban"}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-bg-secondary rounded">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">Estimated Total:</span>
              <span className="font-serif text-2xl">R{totalPrice.toFixed(0)}</span>
            </div>
            <p className="text-xs text-text-muted">* Final price confirmed at collection</p>
          </div>
          <Button onClick={handlePrint} className="w-full gap-2">
            <Printer className="w-4 h-4" /> Generate Waybill & Print
          </Button>
        </Card>
      ) : (
        <Card className="p-5">
          <h2 className="font-serif text-xl mb-4">Individual Claims</h2>
          <p className="text-sm text-text-secondary mb-4">Generate a single PUDO label for each claim in your pipeline.</p>
          <div className="space-y-3 mb-6">
            {[
              { id: "c1", product: "Rooibos Ice Tea", locker: "Sandton City", pin: "4829" },
              { id: "c2", product: "Chai Latte Blend", locker: "Rosebank Mall", pin: "7391" },
              { id: "c3", product: "Winter Beanie", locker: "Menlyn Park", pin: "5512" },
            ].map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded">
                <div>
                  <p className="font-medium text-sm">{claim.product}</p>
                  <p className="text-xs text-text-muted">{claim.locker}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={handlePrint}>
                  <Printer className="w-3 h-3 mr-1" /> Print Label
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}