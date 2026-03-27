import { useState, useEffect } from "react";
import { ArrowLeft, Gift, Users, Star, Zap, Trophy, ChevronRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const LEVELS = [
  { name: "Bronze", minTasks: 0, icon: "🥉" },
  { name: "Silver", minTasks: 20, icon: "🥈" },
  { name: "Gold", minTasks: 50, icon: "🥇" },
];

const EarnMore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ bonus_balance: number; total_tasks_completed: number; level: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("bonus_balance, total_tasks_completed, level")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const totalTasks = profile?.total_tasks_completed || 0;
  const currentLevel = [...LEVELS].reverse().find((l) => totalTasks >= l.minTasks) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel ? Math.min(100, ((totalTasks - currentLevel.minTasks) / (nextLevel.minTasks - currentLevel.minTasks)) * 100) : 100;

  const methods = [
    { icon: Star, title: "Daily Tasks", desc: "Complete 4 daily tasks to earn up to ₦950 every day. Watch ads, share, and more.", cta: "Start Earning", action: () => navigate("/daily-tasks"), badge: "₦950/day" },
    { icon: Gift, title: "Spin & Win", desc: "Spin the lucky wheel once daily for a chance to win up to ₦10,000 instantly.", cta: "Spin Now", action: () => navigate("/spin"), badge: "Up to ₦10K" },
    { icon: Users, title: "Refer Friends", desc: "Earn ₦500 for every friend that joins using your referral code. Unlimited referrals!", cta: "Share Code", action: () => navigate("/main"), badge: "₦500/ref" },
    { icon: Zap, title: "Level Up Rewards", desc: "Complete daily tasks to level up from Bronze → Silver → Gold and unlock bigger rewards.", cta: "View Progress", action: () => navigate("/daily-tasks"), badge: currentLevel.icon + " " + currentLevel.name },
  ];

  return (
    <div className="relative min-h-screen bg-background pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-md mx-auto px-4 pt-4"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate("/main")} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-foreground">Earn More</h1>
            <p className="text-[10px] text-muted-foreground">Multiple ways to boost your balance</p>
          </div>
        </motion.div>

        {/* Earnings Summary */}
        <motion.div variants={item} className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-cta)" }}>
                <Flame className="w-4 h-4 text-background" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Your Level</p>
                <p className="text-sm font-bold text-foreground">{currentLevel.icon} {currentLevel.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">{totalTasks} tasks done</p>
              <p className="text-xs font-bold text-primary">₦{(profile?.bonus_balance || 0).toLocaleString()}</p>
            </div>
          </div>
          {nextLevel && (
            <>
              <Progress value={progressToNext} className="h-1.5 mb-1.5" />
              <p className="text-[9px] text-muted-foreground">{nextLevel.minTasks - totalTasks} tasks to reach {nextLevel.icon} {nextLevel.name}</p>
            </>
          )}
        </motion.div>

        {/* Earning Methods */}
        <motion.p variants={item} className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Ways to Earn</motion.p>
        <div className="space-y-2.5">
          {methods.map(({ icon: Icon, title, desc, cta, action, badge }) => (
            <motion.div key={title} variants={item} className="glass-card rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-cta)", boxShadow: "0 3px 12px hsla(85, 80%, 50%, 0.2)" }}>
                  <Icon className="w-4 h-4 text-background" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[12px] font-bold text-foreground">{title}</p>
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{badge}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
              <button
                onClick={action}
                className="btn-cta w-full h-8 rounded-lg text-[11px] font-bold mt-3 flex items-center justify-center gap-1"
              >
                {cta} <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Daily Tip */}
        <motion.div variants={item} className="glass-card rounded-xl p-3 mt-4 flex items-start gap-2">
          <Trophy className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Pro Tip:</span> Complete all 4 daily tasks every day to level up faster and earn bigger rewards. Gold members get priority withdrawals!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EarnMore;
