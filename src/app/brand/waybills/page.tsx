"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Printer, Info, Package, Layers } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function BrandWaybillsPage() {
  const [mode, setMode] = React.useState<"bulk" | "individual">("bulk");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedBox, setSelectedBox] = React.useState("S");
  const [quantity, setQuantity] = React.useState(1);

  const pricing: Record<string, number> = {
    XS: 50,
    S: 60,
    M: 80,
    L: 100,
    XL: 150,
  };

  const pendingClaims = [
    { id: "CL-1234", campaign: "Summer Skincare Set", user: "John Doe", size: "XS", date: "2024-05-18" },
    { id: "CL-1235", campaign: "Summer Skincare Set", user: "Jane Smith", size: "XS", date: "2024-05-18" },
    { id: "CL-1236", campaign: "Organic Energy Bar", user: "Bob Wilson", size: "S", date: "2024-05-19" },
  ];

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.print();
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Waybill Management</h1>
        <p className="text-text-secondary">Generate and print PUDO shipping labels for your inventory and claims.</p>
      </div>

      <div className="flex p-1 rounded-card bg-bg-secondary w-full max-w-sm">
        <button
          onClick={() => setMode("bulk")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-subtle transition-all",
            mode === "bulk" ? "bg-bg-card shadow-sm text-text-primary" : "text-text-muted hover:text-text-secondary"
          )}
        >
          <Layers className="h-4 w-4" /> Bulk Shipment
        </button>
        <button
          onClick={() => setMode("individual")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-subtle transition-all",
            mode === "individual" ? "bg-bg-card shadow-sm text-text-primary" : "text-text-muted hover:text-text-secondary"
          )}
        >
          <Package className="h-4 w-4" /> Individual Claims
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {mode === "bulk" ? (
            <Card>
              <CardHeader>
                <CardTitle>Bulk Shipment Details</CardTitle>
                <CardDescription>Generate a single waybill to send bulk stock to our sorting hub.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary">Box Size</label>
                    <select 
                      value={selectedBox}
                      onChange={(e) => setSelectedBox(e.target.value)}
                      className="flex h-11 w-full rounded-subtle border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                      <option value="XS">XS (up to 5kg)</option>
                      <option value="S">Small (up to 10kg)</option>
                      <option value="M">Medium (up to 15kg)</option>
                      <option value="L">Large (up to 20kg)</option>
                      <option value="XL">Extra Large (up to 30kg)</option>
                    </select>
                  </div>
                  <Input 
                    label="Number of Boxes" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1" 
                  />
                </div>
                
                <div className="p-4 rounded-card bg-bg-secondary/50 border border-border flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent-secondary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-text-primary">Sorting Hub Address</p>
                    <p className="text-text-secondary">Proe Sorting Center, 123 Industry Rd, Cape Town, 8001</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pending Claims</CardTitle>
                <CardDescription>Select individual claims to generate waybills.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center gap-4 p-4 rounded-card border border-border hover:bg-bg-secondary/30 transition-colors">
                      <input type="checkbox" className="h-4 w-4 rounded border-border text-accent-primary focus:ring-accent-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">{claim.id}</span>
                          <Badge variant="outline">{claim.size}</Badge>
                        </div>
                        <p className="text-xs text-text-muted">{claim.campaign} • {claim.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted">{claim.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-secondary">Rate ({selectedBox})</span>
                <span>{formatCurrency(pricing[selectedBox])}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-secondary">Quantity</span>
                <span>x{quantity}</span>
              </div>
              <div className="flex justify-between py-4 text-lg font-bold text-text-primary">
                <span>Total Cost</span>
                <span>{formatCurrency(pricing[selectedBox] * quantity)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleGenerate}
                isLoading={isLoading}
              >
                <Printer className="mr-2 h-5 w-5" /> Generate & Print
              </Button>
              <p className="text-[10px] text-text-muted text-center mt-4">
                By generating this waybill, you agree to PUDO's terms of service and shipping guidelines.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
