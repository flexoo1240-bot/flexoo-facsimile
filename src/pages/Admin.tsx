import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, RefreshCw, Lock, Image, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  bvn: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  receipt_url: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminCheck();
  const [tab, setTab] = useState<"withdrawals" | "payments">("withdrawals");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [processing, setProcessing] = useState<string | null>(null);
  const [receiptModal, setReceiptModal] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    if (tab === "withdrawals") {
      let query = supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("status", filter);
      const { data } = await query;
      setRequests(data || []);
    } else {
      let query = supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("status", filter);
      const { data } = await query;
      setPayments((data as PaymentRecord[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filter, tab]);

  const handleWithdrawalAction = async (id: string, action: "approved" | "rejected") => {
    setProcessing(id);
    const { error } = await supabase.rpc("admin_update_withdrawal", {
      withdrawal_id: id,
      new_status: action,
      admin_user_id: user?.id || "",
    });
    if (error) toast.error(error.message || "Failed to process request");
    else toast.success(`Request ${action}!`);
    setProcessing(null);
    fetchData();
  };

  const handlePaymentAction = async (id: string, action: "confirmed" | "rejected") => {
    setProcessing(id);
    const { error } = await supabase
      .from("payments")
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error(error.message || "Failed to process");
    else toast.success(`Payment ${action}!`);
    setProcessing(null);
    fetchData();
  };

  const statusIcon = (s: string) => {
    if (s === "pending") return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
    if (s === "approved" || s === "confirmed") return <CheckCircle className="w-3.5 h-3.5 text-primary" />;
    return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  };

  const statusColor = (s: string) =>
    s === "pending" ? "text-yellow-400 bg-yellow-400/10" : (s === "approved" || s === "confirmed") ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10";

  const filters = ["all", "pending", "approved", "rejected"] as const;

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center max-w-sm w-full">
          <Lock className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-lg font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-6">You don't have admin privileges to access this panel.</p>
          <button onClick={() => navigate("/main")} className="btn-cta w-full h-10 rounded-xl text-sm font-bold">Go to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate("/main")} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-foreground">Admin Panel</h1>
            <p className="text-[10px] text-muted-foreground">Manage requests & payments</p>
          </div>
          <button onClick={fetchData} className="ml-auto glass-card w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/30">
            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4">
          {(["withdrawals", "payments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setFilter("pending"); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                tab === t ? "bg-primary/15 text-primary border border-primary/30" : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "withdrawals" ? <CreditCard className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
              {t}
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                filter === f ? "bg-primary/15 text-primary border border-primary/30" : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : tab === "withdrawals" ? (
          requests.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No {filter !== "all" ? filter : ""} withdrawal requests</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {requests.map((req) => (
                <div key={req.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-extrabold text-foreground">₦{req.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(req.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor(req.status)}`}>
                      {statusIcon(req.status)} {req.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: "Bank", value: req.bank_name },
                      { label: "Account No.", value: req.account_number },
                      { label: "Account Name", value: req.account_name },
                      { label: "BVN", value: req.bvn.slice(0, 3) + "****" + req.bvn.slice(-4) },
                    ].map(({ label, value }) => (
                      <div key={label} className="inner-card rounded-lg p-2">
                        <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
                        <p className="text-[11px] font-bold text-foreground truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWithdrawalAction(req.id, "approved")}
                        disabled={processing === req.id}
                        className="btn-cta flex-1 h-9 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleWithdrawalAction(req.id, "rejected")}
                        disabled={processing === req.id}
                        className="btn-danger flex-1 h-9 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          payments.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <Image className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No {filter !== "all" ? filter : ""} payments</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {payments.map((pay) => (
                <div key={pay.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-extrabold text-foreground">₦{pay.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(pay.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor(pay.status)}`}>
                      {statusIcon(pay.status)} {pay.status}
                    </span>
                  </div>

                  {/* Receipt Preview */}
                  {pay.receipt_url && (
                    <button
                      onClick={() => setReceiptModal(pay.receipt_url)}
                      className="w-full mb-3 inner-card rounded-xl p-3 flex items-center gap-3 hover:border-primary/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <img src={pay.receipt_url} alt="Receipt" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-foreground">View Receipt</p>
                        <p className="text-[9px] text-muted-foreground">Tap to view full receipt image</p>
                      </div>
                      <Image className="w-4 h-4 text-muted-foreground ml-auto" />
                    </button>
                  )}

                  <p className="text-[9px] text-muted-foreground mb-2 font-mono-app truncate">User: {pay.user_id.slice(0, 8)}...</p>

                  {pay.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePaymentAction(pay.id, "confirmed")}
                        disabled={processing === pay.id}
                        className="btn-cta flex-1 h-9 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Confirm
                      </button>
                      <button
                        onClick={() => handlePaymentAction(pay.id, "rejected")}
                        disabled={processing === pay.id}
                        className="btn-danger flex-1 h-9 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </motion.div>

      {/* Receipt Modal */}
      {receiptModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReceiptModal(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full max-h-[80vh] overflow-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={receiptModal} alt="Payment receipt" className="w-full rounded-2xl" />
            <button
              onClick={() => setReceiptModal(null)}
              className="btn-cta w-full h-10 rounded-xl text-sm font-bold mt-3"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
