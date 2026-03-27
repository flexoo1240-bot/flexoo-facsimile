import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Eye, Share2, Users, Flame, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const TASKS = [
  { type: "login", label: "Daily Login", desc: "Log in to the app today", icon: Flame, points: 100 },
  { type: "watch_ad", label: "Watch Video", desc: "Watch a short promotional video", icon: Eye, points: 200 },
  { type: "share", label: "Share on Social Media", desc: "Share your referral link", icon: Share2, points: 150 },
  { type: "invite", label: "Invite a Friend", desc: "Get a friend to sign up today", icon: Users, points: 500 },
];

const LEVELS = [
  { name: "Bronze", minTasks: 0, color: "hsl(30, 60%, 50%)", icon: "🥉" },
  { name: "Silver", minTasks: 20, color: "hsl(0, 0%, 70%)", icon: "🥈" },
  { name: "Gold", minTasks: 50, color: "hsl(45, 90%, 55%)", icon: "🥇" },
];

const DailyTasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [{ data: todayTasks }, { data: profile }] = await Promise.all([
        supabase.from("daily_tasks").select("task_type").eq("user_id", user.id).eq("completed_at", today),
        supabase.from("profiles").select("total_tasks_completed").eq("user_id", user.id).single(),
      ]);
      setCompletedTasks(todayTasks?.map((t) => t.task_type) || []);
      setTotalCompleted(profile?.total_tasks_completed || 0);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const currentLevel = [...LEVELS].reverse().find((l) => totalCompleted >= l.minTasks) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel ? Math.min(100, ((totalCompleted - currentLevel.minTasks) / (nextLevel.minTasks - currentLevel.minTasks)) * 100) : 100;

  const completeTask = async (taskType: string) => {
    if (!user || completedTasks.includes(taskType)) return;

    const task = TASKS.find((t) => t.type === taskType);
    if (!task) return;

    // For share task, trigger share dialog
    if (taskType === "share") {
      const { data: profile } = await supabase.from("profiles").select("referral_code").eq("user_id", user.id).single();
      const shareData = {
        title: "Join Flexoo!",
        text: `Sign up on Flexoo with my referral code ${profile?.referral_code} and earn ₦170,000 bonus!`,
        url: `${window.location.origin}/signup?ref=${profile?.referral_code}`,
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch { return; }
      } else {
        navigator.clipboard.writeText(shareData.url);
        toast.success("Referral link copied!");
      }
    }

    // For watch_ad, simulate watching
    if (taskType === "watch_ad") {
      toast.info("Video playing... please wait 5 seconds");
      await new Promise((r) => setTimeout(r, 5000));
    }

    const { error } = await supabase.from("daily_tasks").insert({
      user_id: user.id,
      task_type: taskType,
      points_earned: task.points,
    });

    if (error) {
      if (error.code === "23505") toast.error("Task already completed today!");
      else toast.error("Something went wrong");
      return;
    }

    // Update profile
    await supabase.from("profiles").update({
      bonus_balance: (await supabase.from("profiles").select("bonus_balance").eq("user_id", user.id).single()).data!.bonus_balance + task.points,
      total_tasks_completed: totalCompleted + 1,
    }).eq("user_id", user.id);

    // Check for level up
    const newTotal = totalCompleted + 1;
    const newLevel = [...LEVELS].reverse().find((l) => newTotal >= l.minTasks) || LEVELS[0];
    if (newLevel.name !== currentLevel.name) {
      await supabase.from("profiles").update({ level: newLevel.name.toLowerCase() }).eq("user_id", user.id);
      toast.success(`🎉 Level Up! You're now ${newLevel.icon} ${newLevel.name}!`);
    }

    setCompletedTasks([...completedTasks, taskType]);
    setTotalCompleted(newTotal);
    toast.success(`+₦${task.points} earned!`);
  };

  // Auto-complete login task
  useEffect(() => {
    if (!loading && user && !completedTasks.includes("login")) {
      completeTask("login");
    }
  }, [loading, user]);

  return (
    <div className="relative min-h-screen bg-background pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-md mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/earn-more")} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground">Daily Tasks</h1>
        </div>

        {/* Level Card */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: currentLevel.color }} />
              <div>
                <p className="text-xs font-bold text-foreground">{currentLevel.icon} {currentLevel.name} Level</p>
                <p className="text-[10px] text-muted-foreground">{totalCompleted} tasks completed</p>
              </div>
            </div>
            {nextLevel && (
              <p className="text-[10px] text-muted-foreground">
                Next: {nextLevel.icon} {nextLevel.name}
              </p>
            )}
          </div>
          <Progress value={progressToNext} className="h-2" />
          {nextLevel && (
            <p className="text-[9px] text-muted-foreground mt-1.5">
              {nextLevel.minTasks - totalCompleted} more tasks to level up
            </p>
          )}
        </div>

        {/* Today's Tasks */}
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Today's Tasks</p>
        <div className="space-y-2.5">
          {TASKS.map(({ type, label, desc, icon: Icon, points }) => {
            const done = completedTasks.includes(type);
            return (
              <div key={type} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${done ? "bg-primary/20" : "bg-secondary"}`}>
                    {done ? <CheckCircle className="w-5 h-5 text-primary" /> : <Icon className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">+₦{points}</p>
                  </div>
                </div>
                <button
                  onClick={() => completeTask(type)}
                  disabled={done || type === "login"}
                  className="btn-cta w-full h-8 rounded-lg text-[11px] font-bold mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {done ? "✓ Completed" : type === "login" ? "Auto-completed" : "Complete Task"}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyTasks;
