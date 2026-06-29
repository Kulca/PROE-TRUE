"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  CreditCard,
  ArrowUpRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

function formatZar(amount: number) {
  return `R${Math.abs(amount).toFixed(2)}`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function TierBadge({ tier, status }: { tier: string; status: string }) {
  if (tier === "premium") {
    return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Premium</Badge>;
  }
  if (status === "past_due") {
    return <Badge className="bg-red-100 text-red-800 border-red-300">Past Due</Badge>;
  }
  return <Badge className="bg-slate-100 text-slate-700 border-slate-300">Free</Badge>;
}

export default function BrandBillingPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const billingSummary = useQuery(
    api.billing.getBrandBillingSummary,
    userId ? { brand_id: userId } : "skip"
  );
  const requestPayout = useMutation(api.billing.requestPayout);

  const [loadingUpgrade, setLoadingUpgrade] = React.useState(false);
  const [loadingPayout, setLoadingPayout] = React.useState(false);
  const [showPayoutForm, setShowPayoutForm] = React.useState(false);
  const [payoutAmount, setPayoutAmount] = React.useState("");

  const sub = billingSummary?.subscription;
  const balance = billingSummary?.balance;
  const isPremium = sub?.tier === "premium";
  const availableBalance = balance?.balance_zar ?? 0;
  const minPayout = billingSummary?.minPayout ?? 100;
  const canPayout = availableBalance >= minPayout;

  const handleUpgrade = async () => {
    if (!userId) return;
    setLoadingUpgrade(true);
    // In a real implementation, this would redirect to PayU checkout
    toast("info", "Premium upgrade requires PayU setup. Coming soon.");
    setLoadingUpgrade(false);
  };

  const handlePayout = async () => {
    const amt = parseFloat(payoutAmount);
    if (!amt || amt < minPayout || !userId) return;
    setLoadingPayout(true);
    try {
      await requestPayout({
        brand_id: userId,
        amount_zar: amt,
        bank_account: "Standard Bank •• 1234", // Placeholder — real flow collects bank details
      });
      toast("success", `Payout of ${formatZar(amt)} requested successfully.`);
      setShowPayoutForm(false);
      setPayoutAmount("");
    } catch (err: any) {
      toast("error", err.message ?? "Payout request failed.");
    } finally {
      setLoadingPayout(false);
    }
  };

  if (!userId) {
    return (
      <div className="space-y-8 animate-page">
        <h1 className="text-3xl font-serif text-text-primary">Billing &amp; Subscription</h1>
        <p className="text-text-secondary">Please sign in to manage billing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Billing &amp; Subscription</h1>
        <p className="text-text-secondary">Manage your plan, balance, and payout requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif">Current Plan</CardTitle>
                <TierBadge tier={sub?.tier ?? "free"} status={sub?.status ?? "active"} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPremium ? (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-text-primary">R{(billingSummary as any)?.premiumPrice ?? 99}</span>
                    <span className="text-text-muted">/month</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Your Premium plan renews on {sub?.current_period_end ? formatDate(sub.current_period_end) : "N/A"}.
                    No commission on claims. Unlimited campaigns.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> Unlimited claims
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> Priority billboard placement
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> Full analytics hub
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-text-primary">Free</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    R{billingSummary?.commissionPerClaim ?? 5} commission charged per collected claim.
                    Upgrade to Premium to eliminate commission and unlock unlimited claims.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <Zap className="w-4 h-4 text-amber-500" />{" "}
                      {billingSummary?.commissionPerClaim ?? 5}/claim commission
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <AlertCircle className="w-4 h-4 text-amber-500" /> 50 active claims/month
                    </div>
                  </div>
                  <Button
                    onClick={handleUpgrade}
                    loading={loadingUpgrade}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Premium — R{billingSummary?.premiumPrice ?? 99}/mo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-text-muted mb-1">Available Balance</p>
                  <p className={`text-2xl font-bold ${availableBalance >= 0 ? "text-text-primary" : "text-red-600"}`}>
                    {formatZar(availableBalance)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-text-muted mb-1">Pending Commission</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatZar(balance?.pending_commission_zar ?? 0)}
                  </p>
                </div>
              </div>

              {!isPremium && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Commission being deducted per collected claim
                      </p>
                      <p className="text-sm text-amber-700 mt-0.5">
                        Upgrade to Premium to stop paying {billingSummary?.commissionPerClaim ?? 5}/claim and keep your full balance.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payout */}
              {showPayoutForm ? (
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium">Request Payout</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={minPayout}
                      max={availableBalance}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder={`Min R${minPayout}`}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Button
                      onClick={handlePayout}
                      loading={loadingPayout}
                      disabled={!payoutAmount || parseFloat(payoutAmount) < minPayout}
                    >
                      Request
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPayoutForm(false)}>
                      Cancel
                    </Button>
                  </div>
                  <p className="text-xs text-text-muted">
                    Payouts processed via PayU EFT. Minimum: R{minPayout}.
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowPayoutForm(true)}
                  disabled={!canPayout}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Request Payout
                  {!canPayout && (
                    <span className="ml-2 text-xs text-text-muted">(min R{minPayout})</span>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!billingSummary?.recentTransactions || billingSummary.recentTransactions.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-4">No transactions yet.</p>
                ) : (
                  billingSummary.recentTransactions.map((tx: any) => (
                    <div key={tx._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === "commission_charged" ? "bg-red-50" :
                          tx.type === "payout" ? "bg-blue-50" :
                          tx.type === "topup" ? "bg-green-50" :
                          "bg-slate-50"
                        }`}>
                          {tx.type === "commission_charged" ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : tx.type === "payout" ? (
                            <ArrowUpRight className="w-4 h-4 text-blue-500" />
                          ) : tx.type === "topup" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{tx.description}</p>
                          <p className="text-xs text-text-muted">{formatDate(tx.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        tx.amount_zar < 0 ? "text-red-600" : "text-green-600"
                      }`}>
                        {tx.amount_zar < 0 ? "-" : "+"}{formatZar(tx.amount_zar)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Premium upgrade card */}
          {!isPremium && (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-900">Go Premium</span>
                </div>
                <div className="space-y-2 text-sm text-amber-800">
                  <p>✓ Unlimited campaign claims</p>
                  <p>✓ Zero commission per claim</p>
                  <p>✓ Priority billboard placement</p>
                  <p>✓ Full analytics access</p>
                </div>
                <div className="pt-2 border-t border-amber-200">
                  <p className="text-2xl font-bold text-amber-900">R{billingSummary?.premiumPrice ?? 99}<span className="text-sm font-normal">/month</span></p>
                </div>
                <Button
                  onClick={handleUpgrade}
                  loading={loadingUpgrade}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Invoice history */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif">Invoices</CardTitle>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!billingSummary?.recentInvoices || billingSummary.recentInvoices.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No invoices yet.</p>
              ) : (
                billingSummary.recentInvoices.map((inv: any) => (
                  <div key={inv._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm text-text-primary">{inv.description}</p>
                        <p className="text-xs text-text-muted">{inv.paid_at ? formatDate(inv.paid_at) : "Unpaid"}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">R{inv.amount_zar}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <p className="text-xs text-text-secondary">
                  Commission is deducted from your balance when a tester collects your item (status = collected).
                  Payouts are processed within 3–5 business days via PayU EFT.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}