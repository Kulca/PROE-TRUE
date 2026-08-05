"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/convex/_generated/api";
import {
  Zap, CreditCard, ArrowUpRight, TrendingDown,
  Clock, CheckCircle2, AlertCircle, ChevronRight, Loader2,
} from "lucide-react";

const COMMISSION_PER_CLAIM = 5;
const PREMIUM_PRICE_ZAR = 99;
const MIN_PAYOUT_ZAR = 100;

function formatZar(amount: number) {
  return `R${Math.abs(amount).toFixed(2)}`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function TierBadge({ tier, status }: { tier: string; status: string }) {
  if (tier === "premium") return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Premium</Badge>;
  if (status === "past_due") return <Badge className="bg-red-100 text-red-800 border-red-300">Past Due</Badge>;
  return <Badge className="bg-slate-100 text-slate-700 border-slate-300">Free</Badge>;
}

export default function BrandBillingPage() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [loadingUpgrade, setLoadingUpgrade] = React.useState(false);
  const [loadingPayout, setLoadingPayout] = React.useState(false);
  const [loadingCancel, setLoadingCancel] = React.useState(false);
  const [showPayoutForm, setShowPayoutForm] = React.useState(false);
  const [payoutAmount, setPayoutAmount] = React.useState("");

  const billingSummary = useQuery(
    api.billing.getBrandBillingSummary,
    user?._id ? { brand_id: user._id as any } : "skip"
  );

  const requestPayout = useMutation(api.billing.requestPayout);
  const cancelSub = useMutation(api.subscriptions.cancelSubscription);

  const sub = billingSummary?.subscription;
  const balance = billingSummary?.balance;
  const transactions = billingSummary?.recentTransactions ?? [];
  const invoices = billingSummary?.recentInvoices ?? [];
  const isPremium = sub?.tier === "premium";
  const availableBalance = balance?.balance_zar ?? 0;
  const canPayout = availableBalance >= MIN_PAYOUT_ZAR;

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      toast("success", "Payment successful! Your Premium plan is active.");
      window.history.replaceState({}, "", "/brand/billing");
    } else if (status === "cancelled") {
      toast("error", "Payment was cancelled. You can try again anytime.");
      window.history.replaceState({}, "", "/brand/billing");
    }
  }, [toast]);

  const handleUpgrade = async () => {
    if (!user?._id) return;
    setLoadingUpgrade(true);
    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY || "sk_test_8441f2d29e8979f06754a6b9dca12c81ae3ce010"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: PREMIUM_PRICE_ZAR * 100,
          plan: process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_CODE || "PROE_PREMIUM",
          callback_url: `${window.location.origin}/brand/billing?status=success`,
        }),
      });
      const data = await response.json();
      if (data.status && data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || "Failed to initialize payment.");
      }
    } catch (err: any) {
      toast("error", err.message || "Failed to process upgrade.");
      setLoadingUpgrade(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?._id) return;
    setLoadingCancel(true);
    try {
      await cancelSub({ user_id: user._id as any });
      toast("success", "Subscription cancelled. Access continues until end of billing period.");
    } catch (err: any) {
      toast("error", err.message || "Failed to cancel subscription.");
    } finally {
      setLoadingCancel(false);
    }
  };

  const handlePayout = async () => {
    const amt = parseFloat(payoutAmount);
    if (!amt || amt < MIN_PAYOUT_ZAR || !user?._id) return;
    setLoadingPayout(true);
    try {
      await requestPayout({ brand_id: user._id as any, amount_zar: amt, bank_account: "Paystack Transfer" });
      toast("success", `Payout of R${amt.toFixed(2)} requested successfully.`);
      setShowPayoutForm(false);
      setPayoutAmount("");
    } catch (err: any) {
      toast("error", err.message || "Failed to request payout.");
    } finally {
      setLoadingPayout(false);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-accent-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Billing &amp; Subscription</h1>
        <p className="text-text-secondary">Manage your plan, balance, and payout requests.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                    <span className="text-4xl font-bold text-text-primary">R{PREMIUM_PRICE_ZAR}</span>
                    <span className="text-text-muted">/month</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Your Premium plan renews on {sub?.current_period_end ? formatDate(sub.current_period_end) : "N/A"}.
                    No commission on claims. Unlimited campaigns.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary"><CheckCircle2 className="w-4 h-4 text-green-600" /> Unlimited claims</div>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary"><CheckCircle2 className="w-4 h-4 text-green-600" /> Priority billboard placement</div>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary"><CheckCircle2 className="w-4 h-4 text-green-600" /> Full analytics hub</div>
                  </div>
                  <Button onClick={handleCancelSubscription} loading={loadingCancel} variant="secondary" className="w-full">Cancel Subscription</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2"><span className="text-4xl font-bold text-text-primary">Free</span></div>
                  <p className="text-sm text-text-secondary">R{COMMISSION_PER_CLAIM} commission charged per collected claim. Upgrade to Premium to eliminate commission.</p>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary"><Zap className="w-4 h-4 text-amber-500" /> {COMMISSION_PER_CLAIM}/claim commission</div>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary"><AlertCircle className="w-4 h-4 text-amber-500" /> 50 active claims/month</div>
                  </div>
                  <Button onClick={handleUpgrade} loading={loadingUpgrade} className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Zap className="w-4 h-4 mr-2" /> Upgrade to Premium — R{PREMIUM_PRICE_ZAR}/mo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Balance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-text-muted mb-1">Available Balance</p>
                  <p className={`text-2xl font-bold ${availableBalance >= 0 ? "text-text-primary" : "text-red-600"}`}>{formatZar(availableBalance)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-text-muted mb-1">Pending Commission</p>
                  <p className="text-2xl font-bold text-text-primary">{formatZar(balance?.pending_commission_zar ?? 0)}</p>
                </div>
              </div>
              {!isPremium && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Commission being deducted per collected claim</p>
                      <p className="text-sm text-amber-700 mt-0.5">Upgrade to Premium to stop paying {COMMISSION_PER_CLAIM}/claim.</p>
                    </div>
                  </div>
                </div>
              )}
              {showPayoutForm ? (
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium">Request Payout</p>
                  <div className="flex gap-2">
                    <input type="number" min={MIN_PAYOUT_ZAR} max={availableBalance} value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)} placeholder={`Min R${MIN_PAYOUT_ZAR}`}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    <Button onClick={handlePayout} loading={loadingPayout} disabled={!payoutAmount || parseFloat(payoutAmount) < MIN_PAYOUT_ZAR}>Request</Button>
                    <Button variant="secondary" onClick={() => setShowPayoutForm(false)}>Cancel</Button>
                  </div>
                  <p className="text-xs text-text-muted">Payouts processed via Paystack. Minimum: R{MIN_PAYOUT_ZAR}.</p>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowPayoutForm(true)} disabled={!canPayout} className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" /> Request Payout
                  {!canPayout && <span className="ml-2 text-xs text-text-muted">(min R{MIN_PAYOUT_ZAR})</span>}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Transaction History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 && <p className="text-sm text-text-muted text-center py-4">No transactions yet.</p>}
                {transactions.map((tx: any) => (
                  <div key={tx._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "commission_charged" ? "bg-red-50" : tx.type === "payout" ? "bg-blue-50" : tx.type === "topup" ? "bg-green-50" : "bg-slate-50"}`}>
                        {tx.type === "commission_charged" ? <TrendingDown className="w-4 h-4 text-red-500" /> : tx.type === "payout" ? <ArrowUpRight className="w-4 h-4 text-blue-500" /> : tx.type === "topup" ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <CreditCard className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{tx.description}</p>
                        <p className="text-xs text-text-muted">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.amount_zar < 0 ? "text-red-600" : "text-green-600"}`}>
                      {tx.amount_zar < 0 ? "-" : "+"}{formatZar(tx.amount_zar)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {!isPremium && (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /><span className="font-semibold text-amber-900">Go Premium</span></div>
                <div className="space-y-2 text-sm text-amber-800">
                  <p>✓ Unlimited campaign claims</p><p>✓ Zero commission per claim</p><p>✓ Priority billboard placement</p><p>✓ Full analytics access</p>
                </div>
                <div className="pt-2 border-t border-amber-200">
                  <p className="text-2xl font-bold text-amber-900">R{PREMIUM_PRICE_ZAR}<span className="text-sm font-normal">/month</span></p>
                </div>
                <Button onClick={handleUpgrade} loading={loadingUpgrade} className="w-full bg-amber-500 hover:bg-amber-600 text-white">Upgrade Now</Button>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif">Invoices</CardTitle>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.length === 0 && <p className="text-sm text-text-muted text-center py-4">No invoices yet.</p>}
              {invoices.map((inv: any) => (
                <div key={inv._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-text-primary">{inv.description}</p>
                      <p className="text-xs text-text-muted">{inv.paid_at ? formatDate(inv.paid_at) : "Pending"}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">R{inv.amount_zar}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <p className="text-xs text-text-secondary">
                  Commission is deducted from your balance when a tester collects your item (status = collected).
                  Payouts are processed within 3–5 business days via Paystack.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}