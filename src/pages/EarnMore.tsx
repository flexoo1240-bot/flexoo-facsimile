import { ArrowLeft, Gift, Users, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EarnMore = () => {
  const navigate = useNavigate();

  const methods = [
    { icon: Users, title: "Refer Friends", desc: "Earn ₦7,000 for every friend that joins using your referral code.", cta: "Share Code", action: () => navigate("/main") },
    { icon: Star, title: "Daily Tasks", desc: "Complete simple daily tasks to earn bonus rewards.", cta: "View Tasks", action: undefined },
    { icon: Gift, title: "Spin & Win", desc: "Spin the wheel daily for a chance to win up to ₦10,000.", cta: "Spin Now", action: () => navigate("/spin") },
    { icon: Zap, title: "Level Up", desc: "Upgrade your account tier to unlock higher earning potential.", cta: "Upgrade", action: undefined },
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
          <h1 className="text-sm font-bold text-foreground">Earn More</h1>
        </div>

        <div className="space-y-2.5">
          {methods.map(({ icon: Icon, title, desc, cta, action }) => (
            <div key={title} className="glass-card rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-cta)", boxShadow: "0 3px 12px hsla(85, 80%, 50%, 0.2)" }}>
                  <Icon className="w-4 h-4 text-background" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-foreground mb-0.5">{title}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
              <button onClick={action} className="btn-cta w-full h-8 rounded-lg text-[11px] font-bold mt-3">{cta}</button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EarnMore;
