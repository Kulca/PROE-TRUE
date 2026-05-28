"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const users = useQuery(api.admin.getAllUsers);
  const updateStatus = useMutation(api.admin.updateVerificationStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | "all">("all");

  const handleUpdateStatus = async (userId: any, status: "verified" | "rejected") => {
    try {
      await updateStatus({ user_id: userId, status });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-text-primary">Users & Verification</h1>
          <p className="text-text-secondary mt-1">Manage user accounts and brand verification approvals.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border rounded-subtle text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-muted" />
              <select
                className="bg-bg-secondary border border-border rounded-subtle text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="brand">Brands</option>
                <option value="consumer">Testers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary/50 border-b border-border text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Verification</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!users ? (
                   Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8 h-16 bg-bg-secondary/20" />
                    </tr>
                  ))
                ) : filteredUsers?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => (
                    <tr key={user._id} className="hover:bg-bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center text-white text-xs font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{user.name}</p>
                            <p className="text-xs text-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === "brand" ? (
                          <div className="flex items-center gap-2">
                            {user.verification_docs?.status === "verified" ? (
                              <Badge variant="success" className="gap-1 px-2 py-0.5">
                                <ShieldCheck className="h-3 w-3" /> Verified
                              </Badge>
                            ) : user.verification_docs?.status === "rejected" ? (
                              <Badge variant="destructive" className="gap-1 px-2 py-0.5">
                                <ShieldX className="h-3 w-3" /> Rejected
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="gap-1 px-2 py-0.5">
                                <ShieldAlert className="h-3 w-3" /> Pending
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-text-muted text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role === "brand" && user.verification_docs?.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-success hover:text-success hover:bg-success/5 border-success/20 h-8 px-2"
                              onClick={() => handleUpdateStatus(user._id, "verified")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20 h-8 px-2"
                              onClick={() => handleUpdateStatus(user._id, "rejected")}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                        {user.role === "brand" && user.verification_docs?.status !== "pending" && (
                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                           </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
