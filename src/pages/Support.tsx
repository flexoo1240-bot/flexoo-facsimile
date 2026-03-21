import { ArrowLeft, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Support = () => {
  const navigate = useNavigate();

  const channels = [
    { icon: MessageCircle, label: "Live Chat", desc: "Chat with our support team", action: "Start Chat" },
    { icon: Mail, label: "Email Support", desc: "support@flexoo.com", action: "Send Email" },
    { icon: Phone, label: "Phone Support", desc: "+234 800 FLEXOO", action: "Call Now" },
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
          <h1 className="text-sm font-bold text-foreground">Support</h1>
        </div>

        <div className="space-y-2.5">
          {channels.map(({ icon: Icon, label, desc, action }) => (
            <div key={label} className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
              <button className="text-[10px] font-semibold text-primary flex items-center gap-1">
                {action} <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Support;
