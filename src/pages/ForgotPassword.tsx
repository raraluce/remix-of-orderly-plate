import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Lock, CheckCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Stage = "request" | "sent" | "reset" | "done";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stage, setStage] = useState<Stage>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendLink = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("sent");
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (code.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("reset");
    }, 600);
  };

  const handleResetPassword = () => {
    if (password.length < 6 || password !== confirmPw) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("done");
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm space-y-8"
        >
          {/* ── Request stage ── */}
          {stage === "request" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-display font-bold">Forgot password?</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email and we'll send you a reset code
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-13 rounded-xl bg-card border-border"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm disabled:opacity-40"
                  disabled={!email.includes("@") || loading}
                  onClick={handleSendLink}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <>Send Reset Code <ArrowRight className="ml-2 w-5 h-5" /></>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {/* ── Code sent stage ── */}
          {stage === "sent" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-display font-bold">Check your email</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-14 rounded-xl bg-card border-border text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                />

                <Button
                  size="lg"
                  className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm disabled:opacity-40"
                  disabled={code.length < 6 || loading}
                  onClick={handleVerifyCode}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <button
                  onClick={() => {
                    toast({ title: "Code resent", description: `New code sent to ${email}` });
                  }}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Didn't receive it? <span className="text-primary font-semibold">Resend code</span>
                </button>
              </div>
            </>
          )}

          {/* ── New password stage ── */}
          {stage === "reset" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-display font-bold">New password</h1>
                <p className="text-sm text-muted-foreground mt-1">Choose a strong password for your account</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="New password (min. 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-13 rounded-xl bg-card border-border"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="pl-10 h-13 rounded-xl bg-card border-border"
                  />
                </div>

                {confirmPw.length > 0 && password !== confirmPw && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}

                <Button
                  size="lg"
                  className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm disabled:opacity-40"
                  disabled={password.length < 6 || password !== confirmPw || loading}
                  onClick={handleResetPassword}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Updating…
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </>
          )}

          {/* ── Done stage ── */}
          {stage === "done" && (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center glow-accent mx-auto"
              >
                <CheckCircle className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-2">Password updated!</h2>
                <p className="text-muted-foreground text-sm">Your password has been reset successfully. You can now sign in.</p>
              </div>

              <Button
                size="lg"
                className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                onClick={() => navigate("/login")}
              >
                Back to Sign In <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Back to login (request & sent stages) */}
          {(stage === "request" || stage === "sent") && (
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
