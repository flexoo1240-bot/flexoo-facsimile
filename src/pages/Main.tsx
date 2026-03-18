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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import flexooLogo from "@/assets/flexoo-logo.png";
import promoBanner1 from "@/assets/promo-banner-1.png";
import promoBanner2 from "@/assets/promo-banner-2.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
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

  return (
    <div className="relative min-h-screen bg-background pb-8">
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

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-md mx-auto px-4 pt-5">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              WL
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Welcome back</p>
              <p className="text-sm font-bold text-foreground">weblog logs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          variants={item}
          className="rounded-2xl p-5 mb-4"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Wallet Balance</p>
            <button onClick={() => setShowBalance(!showBalance)} className="ml-auto">
              {showBalance ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
          <p className="text-3xl font-bold text-primary mb-4">
            {showBalance ? "₦170,000" : "••••••"}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground">ID: 813f641a</span>
            </div>
            <button
              onClick={() => navigate("/withdraw")}
              className="h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              style={{ background: "var(--gradient-cta)", color: "hsl(150, 30%, 6%)" }}
            >
              <ArrowDownToLine className="w-3.5 h-3.5" /> Withdraw
            </button>
          </div>
        </motion.div>

        {/* Referral Code Card */}
        <motion.div
          variants={item}
          className="rounded-2xl p-4 mb-4 flex items-center gap-3"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary flex items-center gap-1">
              🎯 Refer & Earn ₦7,000
            </p>
            <p className="text-xs text-muted-foreground">
              Your code: <span className="font-mono font-bold text-foreground">{referralCode}</span>
            </p>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </motion.div>

        {/* Promo Banner Carousel */}
        <motion.div variants={item} className="mb-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={banners[currentBanner]}
              alt="Promo banner"
              className="w-full h-auto object-cover rounded-2xl transition-opacity duration-500"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentBanner ? "bg-primary w-4" : "bg-muted-foreground/30"}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { icon: Sparkles, label: "TOTAL EARNED", value: "₦170,000" },
            { icon: Users, label: "REFERRALS", value: "0" },
            { icon: Sparkles, label: "REF EARNED", value: "₦0" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <div className="flex items-center gap-1 mb-1.5">
                <Icon className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: User, label: "Profile", highlight: false, path: undefined },
              { icon: ShoppingCart, label: "Buy Code", highlight: false, path: "/buy-code" },
              { icon: TrendingUp, label: "Earn More", highlight: true, path: undefined },
              { icon: Clock, label: "History", highlight: false, path: undefined },
              { icon: Headphones, label: "Support", highlight: false, path: undefined },
              { icon: MessageCircle, label: "Channel", highlight: false, path: undefined },
            ].map(({ icon: Icon, label, highlight, path }) => (
              <button
                key={label}
                onClick={() => path && navigate(path)}
                className="flex flex-col items-center gap-2.5 py-4 rounded-xl transition-colors hover:bg-muted/50"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={highlight
                    ? { background: "var(--gradient-cta)" }
                    : { background: "hsla(150, 30%, 18%, 0.8)" }
                  }
                >
                  <Icon className={`w-5 h-5 ${highlight ? "text-background" : "text-primary"}`} />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Main;
