import { ArrowLeft, User, Mail, Phone, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();

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
          <h1 className="text-sm font-bold text-foreground">Profile</h1>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary mb-2">
            WL
          </div>
          <p className="text-sm font-bold text-foreground">weblog logs</p>
          <p className="text-[10px] text-muted-foreground">Member since March 2026</p>
        </div>

        <div className="space-y-2">
          {[
            { icon: User, label: "Full Name", value: "Weblog Logs" },
            { icon: Mail, label: "Email", value: "weblog@example.com" },
            { icon: Phone, label: "Phone", value: "+234 800 000 0000" },
            { icon: Shield, label: "Account Status", value: "Verified" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-[12px] font-bold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
