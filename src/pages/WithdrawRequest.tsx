import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WithdrawRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bvn, setBvn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: profile }, { data: requests }] = await Promise.all([
        supabase.from("profiles").select("bonus_balance").eq("user_id", user.id).single(),
        supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setBalance(profile?.bonus_balance || 0);
      setPendingRequests(requests || []);
    };
    load();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    const amt = Number(amount);
    if (!amt || amt < 1000) return toast.error("Minimum withdrawal is ₦1,000");
    if (amt > balance) return toast.error("Insufficient balance");
    if (!bankName.trim()) return toast.error("Enter bank name");
    if (!accountNumber.trim() || accountNumber.length < 10) return toast.error("Enter valid account number");
    if (!accountName.trim()) return toast.error("Enter account name");
    if (!bvn.trim() || bvn.length !== 11) return toast.error("Enter valid 11-digit BVN");

    setSubmitting(true);
    const { error } = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount: amt,
      bank_name: bankName.trim(),
      account_number: accountNumber.trim(),
      account_name: accountName.trim(),
      bvn: bvn.trim(),
    });

    if (error) {
      toast.error("Failed to submit request");
      setSubmitting(false);
      return;
    }

    // Deduct from balance
    await supabase.from("profiles").update({ bonus_balance: balance - amt }).eq("user_id", user.id);

    toast.success("Withdrawal request submitted! Awaiting admin approval.");
    setBalance(balance - amt);
    setAmount("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setBvn("");
    setSubmitting(false);

    // Refresh requests
    const { data } = await supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
    setPendingRequests(data || []);
  };

  const statusColor = (s: string) => s === "pending" ? "text-yellow-400" : s === "approved" ? "text-primary" : "text-destructive";

  return (
    <div className="relative min-h-screen bg-background pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-md mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <Banknote className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-foreground">Withdraw Funds</h1>
            <p className="text-[10px] text-muted-foreground">Balance: <span className="font-bold text-foreground">₦{balance.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Info */}
        <div className="glass-card rounded-xl p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Withdrawal requests require admin approval. Processing takes 24-48 hours. Minimum withdrawal: <span className="font-bold text-foreground">₦1,000</span>.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. Access Bank"
              className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit account number"
              className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Name on your bank account"
              className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">BVN</label>
            <input
              type="text"
              value={bvn}
              onChange={(e) => setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="11-digit BVN"
              className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-cta w-full h-11 rounded-xl text-sm font-bold disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Withdrawal Request"}
        </button>

        {/* Previous Requests */}
        {pendingRequests.length > 0 && (
          <div className="mt-6">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Recent Requests</p>
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div key={req.id} className="glass-card rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">₦{req.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${statusColor(req.status)}`}>{req.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WithdrawRequest;
