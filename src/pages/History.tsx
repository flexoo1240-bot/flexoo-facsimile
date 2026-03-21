import { ArrowLeft, ArrowDownToLine, ArrowUpRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const History = () => {
  const navigate = useNavigate();

  const transactions = [
    { type: "credit", label: "Activation Bonus", amount: "+₦170,000", date: "Mar 21, 2026", time: "10:32 AM" },
    { type: "debit", label: "Withdrawal", amount: "-₦50,000", date: "Mar 20, 2026", time: "3:15 PM" },
    { type: "credit", label: "Referral Bonus", amount: "+₦7,000", date: "Mar 19, 2026", time: "8:00 AM" },
  ];

  return (
    <div className="relative min-h-screen bg-background pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md mx-auto px-4 pt-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/main")} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground">Transaction History</h1>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-[11px] text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div key={i} className="glass-card rounded-lg p-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-primary/10" : "bg-destructive/10"}`}>
                  {tx.type === "credit" ? (
                    <ArrowDownToLine className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-foreground">{tx.label}</p>
                  <p className="text-[9px] text-muted-foreground">{tx.date} · {tx.time}</p>
                </div>
                <p className={`text-[12px] font-bold ${tx.type === "credit" ? "text-primary" : "text-destructive"}`}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default History;
