"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, XCircle, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

type Tab = "all" | "brands" | "consumers" | "pending";
const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "brands", label: "Brands" },
  { key: "consumers", label: "Consumers" },
  { key: "pending", label: "Pending Verification" },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState<Tab>("all");
  const [search, setSearch] = React.useState("");

  const users = useQuery(api.admin.listUsers, {}) ?? [];
  const verifyBrand = useMutation(api.admin.verifyBrand);

  const filtered = users.filter((u: any) => {
    if (tab === "brands" && u.role !== "brand") return false;
    if (tab === "consumers" && u.role !== "consumer") return false;
    if (tab === "pending" && u.verification_docs?.status !== "pending") return false;
    if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleVerify = async (userId: any, status: "verified" | "rejected") => {
    try {
      await verifyBrand({ userId, status });
      toast("success", `Brand ${status === "verified" ? "approved" : "rejected"} successfully.`);
    } catch (err: any) {
      toast("error", err.message ?? "Failed to update verification status.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">User Management</h1>
        <p className="text-text-secondary mt-1">Manage brands, consumers, and verification.</p>
      </div>

      <div className="flex gap-4 border-b border-border pb-4">
        {TABS.map(({ key, label }) => {
          const count = key === "all" ? users.length
            : key === "brands" ? users.filter((u: any) => u.role === "brand").length
            : key === "consumers" ? users.filter((u: any) => u.role === "consumer").length
            : users.filter((u: any) => u.verification_docs?.status === "pending").length;
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

      {users.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted">No users found.</p>
        </div>
      )}

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
            {filtered.map((user: any) => (
              <tr key={user._id} className="hover:bg-bg-secondary/50 transition-colors">
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
                  {user.verification_docs?.status === "pending" ? (
                    <span className="flex items-center gap-1 text-xs text-warning">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  ) : user.is_verified ? (
                    <Badge variant="accent">Verified</Badge>
                  ) : user.verification_docs?.status === "rejected" ? (
                    <Badge variant="error">Rejected</Badge>
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.role === "brand" && user.verification_docs?.status === "pending" ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleVerify(user._id, "verified")}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVerify(user._id, "rejected")}
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
        {filtered.length === 0 && users.length > 0 && (
          <div className="p-8 text-center text-text-muted text-sm">No users match your filter.</div>
        )}
      </div>
    </div>
  );
}