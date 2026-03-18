import { motion } from "framer-motion";
import { Send } from "lucide-react";
import flexooLogo from "@/assets/flexoo-logo.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Withdraw = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-withdraw" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(150, 20%, 40%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-withdraw)" />
        </svg>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[80px]" />

      {/* Floating particles */}
      {[
        { top: "8%", left: "15%", delay: "0s", size: "w-1.5 h-1.5" },
        { top: "70%", right: "10%", delay: "2s", size: "w-1 h-1" },
        { top: "45%", left: "5%", delay: "4s", size: "w-1 h-1" },
        { top: "25%", right: "20%", delay: "1s", size: "w-1.5 h-1.5" },
        { top: "80%", left: "30%", delay: "3s", size: "w-1 h-1" },
      ].map((p, i) => (
        <div
          key={i}
          className={`particle absolute ${p.size} rounded-full bg-primary/40`}
          style={{ top: p.top, left: p.left, right: p.right, animationDelay: p.delay }}
        />
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full"
      >
        {/* Logo */}
        <motion.div variants={item} className="mb-6">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto shadow-lg" style={{ boxShadow: "var(--glow-green)" }}>
            <img src={flexooLogo} alt="Flexoo" className="w-12 h-12 object-contain" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to <span className="text-primary">Flexoo</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Join our official Telegram channel to get started with announcements, tips & exclusive offers.
          </p>
        </motion.div>

        {/* Telegram Card */}
        <motion.div
          variants={item}
          className="w-full rounded-2xl p-5 mb-6"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#F5C518] flex items-center justify-center">
              <Send className="w-6 h-6 text-background" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Flexoo Official</p>
              <p className="text-xs text-muted-foreground">Telegram Channel</p>
            </div>
          </div>
          <a
            href="https://t.me/flexooofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-cta)", color: "hsl(150, 30%, 6%)" }}
          >
            <Send className="w-4 h-4" />
            Join Channel
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.p variants={item} className="text-xs text-muted-foreground/60">
          You must join our Telegram channel to access the platform.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Withdraw;
