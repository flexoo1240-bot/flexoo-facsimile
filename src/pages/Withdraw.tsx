import { motion } from "framer-motion";
import { ArrowLeft, ArrowDownToLine, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Withdraw = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background pb-8">
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

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />

      {/* Floating particles */}
      {[
        { top: "12%", left: "8%", delay: "0s", size: "w-1.5 h-1.5" },
        { top: "55%", right: "15%", delay: "2s", size: "w-1 h-1" },
        { top: "75%", left: "50%", delay: "3s", size: "w-1.5 h-1.5" },
        { top: "30%", right: "5%", delay: "1s", size: "w-1 h-1" },
      ].map((p, i) => (
        <div
          key={i}
          className={`particle absolute ${p.size} rounded-full bg-primary/40`}
          style={{ top: p.top, left: p.left, right: p.right, animationDelay: p.delay }}
        />
      ))}

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-md mx-auto px-4 pt-5">
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-11 h-11 rounded-full bg-destructive/20 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground">Withdraw</p>
            <p className="text-xs text-muted-foreground">
              Balance: <span className="font-bold text-foreground">₦170,000</span>
            </p>
          </div>
        </motion.div>

        {/* Buy Code Card */}
        <motion.div
          variants={item}
          className="rounded-2xl p-8 flex flex-col items-center text-center"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <div className="w-16 h-16 rounded-full bg-[#F5C518] flex items-center justify-center mb-5">
            <ShoppingCart className="w-7 h-7 text-background" />
          </div>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            You need to buy a withdrawal code<br />before you can withdraw.
          </p>
          <button
            onClick={() => navigate("/buy-code")}
            className="h-11 px-8 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ background: "var(--gradient-cta)", color: "hsl(150, 30%, 6%)" }}
          >
            <ShoppingCart className="w-4 h-4" />
            Buy FPC
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Withdraw;
