import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    let query = supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setProcessing(id);
    
    const { error } = await supabase.rpc("admin_update_withdrawal", {
      withdrawal_id: id,
      new_status: action,
      admin_user_id: user?.id || "",
    });

    if (error) {
      toast.error(error.message || "Failed to process request");
    } else {
      toast.success(`Request ${action}!`);
    }
    
    setProcessing(null);
    fetchRequests();
  };

  const statusIcon = (s: string) => {
    if (s === "pending") return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
    if (s === "approved") return <CheckCircle className="w-3.5 h-3.5 text-primary" />;
    return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  };

  const statusColor = (s: string) =>
    s === "pending" ? "text-yellow-400 bg-yellow-400/10" : s === "approved" ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10";

  const filters = ["all", "pending", "approved", "rejected"] as const;

  return (
    <div className="relative min-h-screen bg-background pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/main")} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-foreground">Admin Panel</h1>
            <p className="text-[10px] text-muted-foreground">Manage withdrawal requests</p>
          </div>
          <button onClick={fetchRequests} className="ml-auto glass-card w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/30">
            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Pending", count: requests.filter((r) => r.status === "pending").length, color: "text-yellow-400" },
            { label: "Approved", count: requests.filter((r) => r.status === "approved").length, color: "text-primary" },
            { label: "Total", count: requests.length, color: "text-foreground" },
          ].map(({ label, count, color }) => (
            <div key={label} className="glass-card rounded-lg p-3 text-center">
              <p className={`text-lg font-extrabold ${color}`}>{count}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
            </div>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No {filter !== "all" ? filter : ""} requests found</p>
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
                    {statusIcon(req.status)}
                    {req.status}
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
                      onClick={() => handleAction(req.id, "approved")}
                      disabled={processing === req.id}
                      className="btn-cta flex-1 h-9 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "rejected", req)}
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
        )}
      </motion.div>
    </div>
  );
};

export default Admin;
