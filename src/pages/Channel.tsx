import { ArrowLeft, MessageCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Channel = () => {
  const navigate = useNavigate();

  const channels = [
    { name: "Telegram Channel", desc: "Get updates & announcements", link: "#", members: "12.5K" },
    { name: "WhatsApp Group", desc: "Join the community chat", link: "#", members: "8.2K" },
    { name: "Instagram", desc: "Follow for tips & promos", link: "#", members: "5.1K" },
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
          <h1 className="text-sm font-bold text-foreground">Community Channels</h1>
        </div>

        <div className="space-y-2.5">
          {channels.map(({ name, desc, link, members }) => (
            <a key={name} href={link} className="glass-card rounded-xl p-4 flex items-center gap-3 block">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-foreground">{name}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-primary">{members}</p>
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Channel;
