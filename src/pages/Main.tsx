import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Eye,
  EyeOff,
  ArrowDownToLine,
  Bell,
  LogOut,
  Users,
  Copy,
  CheckCircle,
  User,
  ShoppingCart,
  TrendingUp,
  Clock,
  Headphones,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import flexooLogo from "@/assets/flexoo-logo.png";
import promoBanner1 from "@/assets/promo-banner-1.png";
import promoBanner2 from "@/assets/promo-banner-2.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const banners = [promoBanner1, promoBanner2];

const Main = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const referralCode = "FLEXO5BDAC8";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickActions = [
    { icon: User, label: "Profile", highlight: false, path: "/profile" },
    { icon: ShoppingCart, label: "Buy Code", highlight: false, path: "/buy-code" },
    { icon: TrendingUp, label: "Earn More", highlight: true, path: "/earn-more" },
    { icon: Clock, label: "History", highlight: false, path: "/history" },
    { icon: Headphones, label: "Support", highlight: false, path: "/support" },
    { icon: MessageCircle, label: "Channel", highlight: false, path: "/channel" },
  ];

  const stats = [
    { icon: Sparkles, label: "TOTAL EARNED", value: "₦170,000" },
    { icon: Users, label: "REFERRALS", value: "0" },
    { icon: Sparkles, label: "REF EARNED", value: "₦0" },
  ];

  return (
    <div className="relative min-h-screen bg-background pb-10">
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

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-md mx-auto px-4 pt-4">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-[0_0_16px_hsla(85,80%,50%,0.08)]">
              WL
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Welcome back</p>
              <p className="text-[13px] font-bold text-foreground tracking-tight">weblog logs</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="glass-card w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/30 transition-colors">
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button className="glass-card w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/30 transition-colors">
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Wallet Card */}
        <motion.div variants={item} className="glass-card rounded-xl p-4 mb-3 relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer pointer-events-none rounded-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Wallet className="w-3 h-3 text-primary" />
              </div>
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Wallet Balance</p>
              <button onClick={() => setShowBalance(!showBalance)} className="ml-auto p-1 rounded-md hover:bg-muted/30 transition-colors">
                {showBalance ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>

            <p className="text-[26px] font-extrabold text-primary mb-0.5 tracking-tight leading-none">
              {showBalance ? "₦170,000" : "••••••"}
            </p>
            <p className="text-[9px] text-muted-foreground mb-3 font-medium">
              {showBalance ? "Available for withdrawal" : "Balance hidden"}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_hsla(85,80%,50%,0.5)]" />
                  <span className="text-[9px] font-semibold text-muted-foreground">Active</span>
                </div>
                <span className="text-muted-foreground/30">|</span>
                <span className="text-[9px] font-mono-app text-muted-foreground">ID: 0b342d98</span>
              </div>
              <button
                onClick={() => navigate("/withdraw")}
                className="btn-cta h-8 px-4 rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                <ArrowDownToLine className="w-3 h-3" /> Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        {/* Referral Code Card */}
        <motion.div variants={item} className="glass-card rounded-xl p-3 mb-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-primary flex items-center gap-1 mb-0.5">
              🎯 Refer & Earn ₦7,000
            </p>
            <p className="text-[10px] text-muted-foreground">
              Your code: <span className="font-mono-app font-bold text-foreground tracking-wider">{referralCode}</span>
            </p>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all hover:bg-muted/40"
            style={{ color: copied ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
          >
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </motion.div>

        {/* Promo Banner Carousel */}
        <motion.div variants={item} className="mb-4">
          <div className="relative rounded-lg overflow-hidden border border-border/50 h-[100px]">
            <img
              src={banners[currentBanner]}
              alt="Promo banner"
              className="w-full h-full object-cover rounded-lg transition-opacity duration-700"
            />
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentBanner ? "bg-primary w-4" : "bg-muted-foreground/25 w-1"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2 mb-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="inner-card rounded-lg p-2.5">
              <div className="flex items-center gap-1 mb-1.5">
                <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                  <Icon className="w-2 h-2 text-primary" />
                </div>
                <p className="text-[7px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
              </div>
              <p className="text-[13px] font-extrabold text-foreground tracking-tight">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map(({ icon: Icon, label, highlight, path }) => (
              <button
                key={label}
                onClick={() => path && navigate(path)}
                className="inner-card flex flex-col items-center gap-2 py-3 rounded-lg transition-all duration-200 hover:border-primary/20 hover:shadow-[0_0_15px_hsla(85,80%,50%,0.05)] active:scale-[0.97]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200"
                  style={highlight
                    ? { background: "var(--gradient-cta)", boxShadow: "0 3px 12px hsla(85, 80%, 50%, 0.2)" }
                    : { background: "hsla(150, 30%, 18%, 0.8)" }
                  }
                >
                  <Icon className={`w-4 h-4 ${highlight ? "text-background" : "text-primary"}`} />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Main;
