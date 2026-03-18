import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  Upload,
  ExternalLink,
  User,
  Landmark,
  CreditCard,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

type Step = "notice" | "payment";

const Payment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("notice");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen bg-background pb-10">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-payment" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(150, 20%, 40%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-payment)" />
        </svg>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px]" />

      {/* Floating particles */}
      {[
        { top: "10%", left: "6%", delay: "0s", size: "w-1.5 h-1.5" },
        { top: "50%", right: "12%", delay: "2s", size: "w-1 h-1" },
        { top: "70%", left: "45%", delay: "3s", size: "w-1.5 h-1.5" },
        { top: "28%", right: "4%", delay: "1s", size: "w-1 h-1" },
      ].map((p, i) => (
        <div
          key={i}
          className={`particle absolute ${p.size} rounded-full bg-primary/30`}
          style={{ top: p.top, left: p.left, right: (p as any).right, animationDelay: p.delay }}
        />
      ))}

      <div className="relative z-10 max-w-md mx-auto px-4 pt-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3 mb-7"
        >
          <button
            onClick={() => step === "notice" ? navigate(-1) : setStep("notice")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-secondary/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-11 h-11 rounded-full bg-[#F5C518] flex items-center justify-center shadow-lg shadow-[#F5C518]/10">
            <ShoppingCart className="w-5 h-5 text-background" />
          </div>
          <p className="text-[15px] font-bold text-foreground tracking-tight">Buy Withdrawal Code</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "notice" ? (
            /* Important Payment Notice */
            <motion.div
              key="notice"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            >
              <motion.div
                variants={item}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#F5C518]/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-[#F5C518]" />
                  </div>
                  <h2 className="text-[17px] font-bold text-foreground tracking-tight">Important Payment Notice</h2>
                </div>

                <ul className="space-y-3.5 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      Transfer the <span className="font-semibold text-foreground">exact amount</span> shown on this page.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      Upload a clear <span className="font-semibold text-foreground">payment screenshot</span> immediately after transfer.
                    </p>
                  </li>
                </ul>

                {/* Opay Warning */}
                <div
                  className="rounded-xl p-4 mb-6"
                  style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)" }}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-destructive">Avoid using Opay bank</span>. Due to temporary network issues from Opay servers, payments made with Opay may not be confirmed. Please use{" "}
                      <span className="font-semibold text-foreground">any other Nigerian bank</span> for instant confirmation.
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 mb-7">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      Payments made with other banks are confirmed within minutes.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      Do not dispute your payment under any circumstances — disputes delay confirmation.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep("payment")}
                  className="btn-danger w-full h-12 rounded-xl text-sm flex items-center justify-center"
                >
                  I Understand
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* Payment Details */
            <motion.div
              key="payment"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {/* Payment Instructions */}
              <motion.div variants={item} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                    Payment Instructions
                  </p>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    ₦7,500
                  </span>
                </div>

                <p className="text-[13px] text-muted-foreground mb-5">
                  Transfer <span className="font-semibold text-foreground">₦7,500</span> to the account below:
                </p>

                {/* Bank Details */}
                <div className="space-y-2.5 mb-5">
                  {[
                    { icon: Landmark, label: "BANK", value: "Moniepoint MFB", copyVal: "Moniepoint MFB" },
                    { icon: CreditCard, label: "ACCOUNT NUMBER", value: "5240391212", copyVal: "5240391212", mono: true },
                    { icon: User, label: "ACCOUNT NAME", value: "VICTOR OBINNA EMEKA", copyVal: "VICTOR OBINNA EMEKA" },
                  ].map(({ icon: Icon, label, value, copyVal, mono }) => (
                    <motion.div
                      key={label}
                      whileTap={{ scale: 0.99 }}
                      className="inner-card flex items-center gap-3 rounded-xl px-4 py-3.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">{label}</p>
                        <p className={`text-sm font-bold text-foreground ${mono ? "font-mono-app tracking-wide" : ""}`}>
                          {value}
                        </p>
                      </div>
                      <button
                        onClick={() => copyText(copyVal, label)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                      >
                        {copiedField === label ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Pay with Transfer Link */}
                <button className="btn-cta w-full h-11 rounded-xl text-sm flex items-center justify-center gap-2 mb-4">
                  <ExternalLink className="w-4 h-4" />
                  Pay with Transfer Link
                </button>

                {/* Purchasing as */}
                <div className="inner-card flex items-center gap-2.5 rounded-xl px-4 py-3">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Purchasing as:</span>
                  <span className="text-xs font-bold text-foreground font-mono-app">ndslt0245208</span>
                </div>
              </motion.div>

              {/* After Payment - Upload Receipt */}
              <motion.div variants={item} className="glass-card rounded-2xl p-5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3">
                  After Payment
                </p>
                <p className="text-[13px] text-muted-foreground mb-4">
                  Upload your payment receipt below
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Upload Zone */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`upload-zone w-full rounded-xl p-7 flex flex-col items-center gap-2.5 mb-5 ${receiptPreview ? "border-primary/50" : ""}`}
                >
                  {receiptPreview ? (
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-full max-h-48 object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mb-1">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Tap to upload receipt</p>
                      <p className="text-[11px] text-muted-foreground">JPG, PNG • Max 5MB</p>
                    </>
                  )}
                </button>

                <button
                  className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    receiptFile
                      ? "btn-cta"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                  disabled={!receiptFile}
                >
                  <Shield className="w-4 h-4" />
                  Submit Payment Proof
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Payment;
