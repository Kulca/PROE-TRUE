"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ActiveIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Locker {
  id: string;
  name: string;
  address: string;
  province: string;
  lat: number;
  lng: number;
}

const mockLockers: Locker[] = [
  { id: "1", name: "Rosebank Mall", address: "15A Cradock Ave, Rosebank, Johannesburg", province: "Gauteng", lat: -26.145, lng: 28.043 },
  { id: "2", name: "Sandton City", address: "83 Rivonia Rd, Sandhurst, Sandton", province: "Gauteng", lat: -26.107, lng: 28.056 },
  { id: "3", name: "V&A Waterfront", address: "19 Dock Rd, Cape Town", province: "Western Cape", lat: -33.903, lng: 18.423 },
  { id: "4", name: "Gateway Theatre", address: "1 Palm Blvd, Umhlanga Rocks, Durban", province: "KwaZulu-Natal", lat: -29.725, lng: 31.066 },
];

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 13);
  }, [center]);
  return null;
}

export function LockerFinder({ onSelect, selectedId, province }: { onSelect: (locker: Locker) => void, selectedId?: string, province?: string }) {
  const [search, setSearch] = React.useState("");
  const [view, setView] = React.useState<"map" | "list">("map");
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([-26.145, 28.043]);
  const [filteredLockers, setFilteredLockers] = React.useState(mockLockers);

  React.useEffect(() => {
    let filtered = mockLockers;
    if (province) {
      filtered = filtered.filter(l => l.province === province);
    }
    if (search) {
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(search.toLowerCase()) || 
        l.address.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredLockers(filtered);
    if (filtered.length > 0) {
      setMapCenter([filtered[0].lat, filtered[0].lng]);
    }
  }, [search, province]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handled by useEffect
  };

  return (
    <div className="flex flex-col h-[500px] border border-border rounded-card overflow-hidden">
      <div className="p-4 border-b border-border bg-white flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search by area or mall name..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="flex p-1 bg-bg-secondary rounded-subtle self-start sm:self-center">
          <button 
            onClick={() => setView("map")}
            className={cn("px-4 py-1.5 text-xs font-medium rounded-subtle transition-all", view === "map" ? "bg-white shadow-sm text-text-primary" : "text-text-muted")}
          >
            Map
          </button>
          <button 
            onClick={() => setView("list")}
            className={cn("px-4 py-1.5 text-xs font-medium rounded-subtle transition-all", view === "list" ? "bg-white shadow-sm text-text-primary" : "text-text-muted")}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col md:flex-row">
        {view === "list" ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-secondary/30">
            {filteredLockers.map((locker) => (
              <div 
                key={locker.id} 
                className={cn(
                  "p-4 rounded-card border transition-all cursor-pointer bg-white",
                  selectedId === locker.id ? "border-accent-primary ring-1 ring-accent-primary" : "border-border hover:border-accent-primary/50"
                )}
                onClick={() => onSelect(locker)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h4 className="font-medium text-text-primary">{locker.name}</h4>
                    <p className="text-xs text-text-secondary mt-1">{locker.address}</p>
                  </div>
                  <Button variant={selectedId === locker.id ? "primary" : "secondary"} size="sm" className="shrink-0">
                    {selectedId === locker.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <MapController center={mapCenter} />
              {filteredLockers.map((locker) => (
                <Marker 
                  key={locker.id} 
                  position={[locker.lat, locker.lng]}
                  icon={selectedId === locker.id ? ActiveIcon : DefaultIcon}
                  eventHandlers={{
                    click: () => onSelect(locker),
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-sm">{locker.name}</p>
                      <p className="text-xs text-text-secondary">{locker.address}</p>
                      <Button size="sm" className="w-full mt-2 h-7" onClick={() => onSelect(locker)}>
                        Select Locker
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
