"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, XCircle, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const MOCK_USERS = [
  { id: "1", name: "Cape Brew Co.", email: "hello@capebrew.co.za", role: "brand", is_verified: true, verification_status: "verified", createdAt: "2024-01-15" },
  { id: "2", name: "Glow Beauty", email: "team@glowbeauty.co.za", role: "brand", is_verified: true, verification_status: "verified", createdAt: "2024-02-01" },
  { id: "3", name: "Safari Spices", email: "info@safaryspices.co.za", role: "brand", is_verified: false, verification_status: "pending", createdAt: "2024-03-10" },
  { id: "4", name: "JHB Knitwear", email: "orders@jhbkintwear.co.za", role: "brand", is_verified: false, verification_status: "pending", createdAt: "2024-03-20" },
  { id: "5", name: "Nomvuso Dlamini", email: "nomvuso@gmail.com", role: "consumer", is_verified: false, verification_status: null, createdAt: "2024-03-22" },
  { id: "6", name: "Durban Flavours", email: "hello@durbanflavours.co.za", role: "brand", is_verified: true, verification_status: "verified", createdAt: "2024-02-14" },
];

type Tab = "all" | "brands" | "consumers" | "pending";
const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "brands", label: "Brands" },
  { key: "consumers", label: "Consumers" },
  { key: "pending", label: "Pending Verification" },
];

export default function AdminUsersPage() {
  const [tab, setTab] = React.useState<Tab>("all");
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState(MOCK_USERS);

  const filtered = users.filter((u) => {
    if (tab === "brands" && u.role !== "brand") return false;
    if (tab === "consumers" && u.role !== "consumer") return false;
    if (tab === "pending" && u.verification_status !== "pending") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleVerify = (id: string, status: "verified" | "rejected") => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, is_verified: status === "verified", verification_status: status }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">User Management</h1>
        <p className="text-text-secondary mt-1">Manage brands, consumers, and verification.</p>
      </div>

      <div className="flex gap-4 border-b border-border pb-4">
        {TABS.map(({ key, label }) => {
          const count = key === "all" ? users.length : key === "brands" ? users.filter((u) => u.role === "brand").length : key === "consumers" ? users.filter((u) => u.role === "consumer").length : users.filter((u) => u.verification_status === "pending").length;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                tab === key ? "border-accent-primary text-text-primary" : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {label} <span className="ml-1 text-xs text-text-muted">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 max-w-md" />
      </div>

      <div className="rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Email</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Role</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-bg-secondary/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.is_verified && <ShieldCheck className="h-4 w-4 text-accent-primary shrink-0" />}
                    <span className="font-medium text-text-primary">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "brand" ? "accent" : "secondary"}>{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  {user.verification_status === "pending" ? (
                    <span className="flex items-center gap-1 text-xs text-warning">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  ) : user.verification_status === "verified" ? (
                    <Badge variant="accent">Verified</Badge>
                  ) : user.verification_status === "rejected" ? (
                    <Badge variant="error">Rejected</Badge>
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.role === "brand" && user.verification_status === "pending" ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleVerify(user.id, "verified")}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVerify(user.id, "rejected")}
                      >
                        <XCircle className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-text-muted text-sm">No users found.</div>
        )}
      </div>
    </div>
  );
}
