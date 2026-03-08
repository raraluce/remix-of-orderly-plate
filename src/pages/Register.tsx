import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Utensils,
  AlertTriangle,
  Flame,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppUser } from "@/contexts/AppUserContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const ALLERGENS = ["Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"];
const DIETARY = ["Vegetarian", "Vegan", "Pescatarian", "Halal", "Kosher", "Keto", "Paleo"];
const SPICE_LEVELS = [
  { key: "mild", label: "Mild", emoji: "🌶️" },
  { key: "medium", label: "Medium", emoji: "🌶️🌶️" },
  { key: "hot", label: "Hot", emoji: "🌶️🌶️🌶️" },
  { key: "extra-hot", label: "Fire", emoji: "🔥" },
];

const TOTAL_STEPS = 5;

const Register = () => {
  const navigate = useNavigate();
  const { setAppUser } = useAppUser();
  const { allergens, dietary, toggleAllergen, toggleDietary } = useUserPreferences();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spice, setSpice] = useState("medium");
  const [direction, setDirection] = useState(1);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const finish = () => {
    setAppUser(true);
    navigate("/explore");
  };

  const canAdvance = () => {
    if (step === 0) return true; // welcome
    if (step === 1) return name.trim().length >= 2 && email.includes("@") && password.length >= 6;
    return true;
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {step > 0 && (
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {step} of {TOTAL_STEPS - 1}
            </span>
            {step < TOTAL_STEPS - 1 ? (
              <button onClick={next} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Skip
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
          <Progress value={progress} className="h-1 bg-secondary" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-sm mx-auto"
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-20 h-20 rounded-3xl gradient-accent flex items-center justify-center glow-accent mx-auto mb-6">
                    <Utensils className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-4xl font-display font-bold mb-3">
                    Welcome to <span className="text-gradient">.bite</span>
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    Your personal dining companion. Let&apos;s set up your profile so we can tailor every experience to you.
                  </p>
                </motion.div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                    onClick={next}
                  >
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-4 text-muted-foreground">or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-13 rounded-2xl border-border text-sm font-semibold"
                      onClick={next}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-13 rounded-2xl border-border text-sm font-semibold"
                      onClick={next}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Apple
                    </Button>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-4">
                    Quick sign-in will still guide you through preference setup
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-1">Your details</h2>
                  <p className="text-sm text-muted-foreground">Tell us a little about yourself</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-13 rounded-xl bg-card border-border"
                    />
                  </div>
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password (min. 6 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-13 rounded-xl bg-card border-border"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Allergens */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-display font-bold">Allergens</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select any allergens so we can flag dishes for you
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {ALLERGENS.map((a) => {
                    const active = allergens.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAllergen(a)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                          active
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                        }`}
                      >
                        {a}
                        {active && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  You can update these anytime in your profile
                </p>
              </div>
            )}

            {/* Step 3: Dietary Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Utensils className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-display font-bold">Diet & Taste</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Help us personalize your menu experience</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Dietary preference
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY.map((d) => {
                      const active = dietary.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleDietary(d)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            active
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Spice tolerance
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {SPICE_LEVELS.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSpice(s.key)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${
                          spice === s.key
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                        }`}
                      >
                        <span className="text-lg">{s.emoji}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: All Set */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center glow-accent mx-auto"
                >
                  <Check className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    You&apos;re all set, {name.split(" ")[0] || "foodie"}!
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your profile is ready. We&apos;ll personalize menus, flag allergens, and recommend dishes just for you.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your summary</p>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Allergens</span>
                    <span className="text-sm font-medium">
                      {allergens.length > 0 ? allergens.join(", ") : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Diet</span>
                    <span className="text-sm font-medium">
                      {dietary.length > 0 ? dietary.join(", ") : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Spice</span>
                    <span className="text-sm font-medium capitalize">{spice}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                  onClick={finish}
                >
                  Start Exploring <ChevronRight className="ml-1 w-5 h-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom next button (steps 1-3) */}
      {step >= 1 && step <= 3 && (
        <div className="px-6 pb-8 pt-4">
          <Button
            size="lg"
            className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm disabled:opacity-40"
            disabled={!canAdvance()}
            onClick={next}
          >
            Continue <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Register;
