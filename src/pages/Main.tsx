import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ListChecks,
  Users,
  ArrowDownToLine,
  Bell,
  User,
  ChevronRight,
  Gift,
  TrendingUp,
  Copy,
  CheckCircle,
} from "lucide-react";
import flexooLogo from "@/assets/flexoo-logo.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const tasks = [
  { id: 1, title: "Watch a short video", reward: "₦500", done: false },
  { id: 2, title: "Follow us on Instagram", reward: "₦300", done: false },
  { id: 3, title: "Share on WhatsApp Status", reward: "₦400", done: false },
  { id: 4, title: "Complete a survey", reward: "₦600", done: true },
];

const Main = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "FLEX-29X7KP";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-background pb-24">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-main" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(150, 20%, 40%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-main)" />
        </svg>
      </div>

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-md mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              <img src={flexooLogo} alt="Flexoo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="text-sm font-semibold text-foreground">Flexoo User</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center relative" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          variants={item}
          className="rounded-2xl p-5 mb-5"
          style={{
            background: "var(--gradient-cta)",
            boxShadow: "0 8px 32px hsla(85, 80%, 50%, 0.15)",
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "hsla(150, 30%, 6%, 0.7)" }}>
            Total Balance
          </p>
          <p className="text-3xl font-bold mb-4" style={{ color: "hsl(150, 30%, 6%)" }}>
            ₦170,000<span className="text-base font-normal opacity-60">.00</span>
          </p>
          <div className="flex gap-3">
            <button className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-background/20 backdrop-blur-sm" style={{ color: "hsl(150, 30%, 6%)" }}>
              <ArrowDownToLine className="w-3.5 h-3.5" /> Withdraw
            </button>
            <button className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-background/20 backdrop-blur-sm" style={{ color: "hsl(150, 30%, 6%)" }}>
              <TrendingUp className="w-3.5 h-3.5" /> Earn More
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: ListChecks, label: "Tasks" },
            { icon: Users, label: "Referrals" },
            { icon: ArrowDownToLine, label: "Withdraw" },
            { icon: Gift, label: "Bonus" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2 py-3 rounded-xl transition-colors hover:bg-muted/50"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Referral Card */}
        <motion.div
          variants={item}
          className="rounded-2xl p-4 mb-6"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Invite & Earn</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">₦1,000/referral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-9 rounded-lg px-3 flex items-center text-xs text-muted-foreground font-mono bg-muted/30 border border-border/50">
              {referralCode}
            </div>
            <button
              onClick={copyCode}
              className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary/15 text-primary transition-colors hover:bg-primary/25"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Daily Tasks</p>
            <button className="text-[10px] text-primary font-medium flex items-center gap-0.5">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${task.done ? "bg-primary/20" : "bg-muted/50"}`}>
                  {task.done ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <ListChecks className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Earn {task.reward}</p>
                </div>
                {!task.done && (
                  <button
                    className="h-7 px-3 rounded-lg text-[10px] font-semibold"
                    style={{ background: "var(--gradient-cta)", color: "hsl(150, 30%, 6%)" }}
                  >
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{ background: "hsla(150, 30%, 6%, 0.95)", borderTop: "1px solid var(--glass-border)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-md mx-auto flex items-center justify-around py-2.5 px-4">
          {[
            { icon: Wallet, label: "Home", active: true },
            { icon: ListChecks, label: "Tasks", active: false },
            { icon: Users, label: "Referrals", active: false },
            { icon: User, label: "Profile", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className="flex flex-col items-center gap-1 py-1 px-3">
              <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground/60"}`} />
              <span className={`text-[9px] font-medium ${active ? "text-primary" : "text-muted-foreground/60"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
