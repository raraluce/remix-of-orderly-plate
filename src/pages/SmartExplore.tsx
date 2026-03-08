import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowLeft, Heart, Users, Briefcase, User, PartyPopper,
  Baby, Utensils, Star, MapPin, Clock, CalendarDays, ChevronRight,
  Flame, Leaf, Wine, Coffee, Pizza, Fish,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurants, type RestaurantListing, type CuisineType, type VibeType, type OccasionType, type BudgetType } from "@/data/restaurants";
import ReservationSheet from "@/components/app/ReservationSheet";
import BottomNav from "@/components/app/BottomNav";

const STEPS = ["welcome", "occasion", "cuisine", "vibe", "budget", "loading", "results"] as const;
type Step = typeof STEPS[number];

const pageVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const occasionOptions: { id: OccasionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "date", label: "Date night", icon: <Heart className="w-5 h-5" />, desc: "Romantic & intimate" },
  { id: "friends", label: "With friends", icon: <Users className="w-5 h-5" />, desc: "Fun & social" },
  { id: "business", label: "Business", icon: <Briefcase className="w-5 h-5" />, desc: "Impress & network" },
  { id: "solo", label: "Solo dining", icon: <User className="w-5 h-5" />, desc: "Just me, quality food" },
  { id: "celebration", label: "Celebration", icon: <PartyPopper className="w-5 h-5" />, desc: "Special occasion" },
  { id: "family", label: "Family meal", icon: <Baby className="w-5 h-5" />, desc: "All ages welcome" },
];

const cuisineOptions: { id: CuisineType; label: string; emoji: string }[] = [
  { id: "european", label: "European", emoji: "🍽️" },
  { id: "japanese", label: "Japanese", emoji: "🍣" },
  { id: "italian", label: "Italian", emoji: "🍝" },
  { id: "mexican", label: "Mexican", emoji: "🌮" },
  { id: "indian", label: "Indian", emoji: "🍛" },
  { id: "american", label: "American", emoji: "🍔" },
];

const vibeOptions: { id: VibeType; label: string; icon: React.ReactNode }[] = [
  { id: "romantic", label: "Romantic", icon: <Heart className="w-4 h-4" /> },
  { id: "casual", label: "Casual", icon: <Coffee className="w-4 h-4" /> },
  { id: "fine-dining", label: "Fine dining", icon: <Wine className="w-4 h-4" /> },
  { id: "trendy", label: "Trendy", icon: <Flame className="w-4 h-4" /> },
  { id: "cozy", label: "Cozy", icon: <Leaf className="w-4 h-4" /> },
  { id: "family", label: "Family-friendly", icon: <Baby className="w-4 h-4" /> },
];

const budgetOptions: { id: BudgetType; label: string; desc: string }[] = [
  { id: "$", label: "$", desc: "Budget-friendly" },
  { id: "$$", label: "$$", desc: "Mid-range" },
  { id: "$$$", label: "$$$", desc: "Premium" },
  { id: "$$$$", label: "$$$$", desc: "Splurge" },
];

const SmartExplore = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [occasion, setOccasion] = useState<OccasionType | null>(null);
  const [cuisines, setCuisines] = useState<CuisineType[]>([]);
  const [vibes, setVibes] = useState<VibeType[]>([]);
  const [budget, setBudget] = useState<BudgetType[]>([]);
  const [results, setResults] = useState<RestaurantListing[]>([]);
  const [reserveTarget, setReserveTarget] = useState<RestaurantListing | null>(null);

  const toggleCuisine = (c: CuisineType) =>
    setCuisines((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleVibe = (v: VibeType) =>
    setVibes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
  const toggleBudget = (b: BudgetType) =>
    setBudget((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const generateResults = () => {
    setStep("loading");
    setTimeout(() => {
      let scored = restaurants.map((r) => {
        let score = 0;
        if (occasion && r.occasions.includes(occasion)) score += 3;
        if (cuisines.length === 0 || r.cuisineTypes.some((c) => cuisines.includes(c))) score += 2;
        if (vibes.length === 0 || r.vibes.some((v) => vibes.includes(v))) score += 2;
        if (budget.length === 0 || budget.includes(r.priceRange)) score += 2;
        // Bonus for high rating
        score += r.rating >= 4.7 ? 1 : 0;
        return { ...r, score };
      });
      scored.sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 5));
      setStep("results");
    }, 1500);
  };

  const stepIndex = STEPS.indexOf(step);
  const progressSteps = ["occasion", "cuisine", "vibe", "budget"];
  const progressIndex = progressSteps.indexOf(step);
  const progress = step === "results" || step === "loading" ? 100 : progressIndex >= 0 ? ((progressIndex + 1) / progressSteps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      {step !== "welcome" && step !== "loading" && (
        <header className="px-4 pt-12 pb-2 flex items-center gap-3">
          <button
            onClick={() => {
              const idx = STEPS.indexOf(step);
              if (idx > 0) setStep(STEPS[idx - 1]);
              else navigate(-1);
            }}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-accent rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          <button
            onClick={() => navigate("/explore")}
            className="text-xs text-muted-foreground font-medium"
          >
            Skip
          </button>
        </header>
      )}

      <div className="flex-1 flex flex-col justify-center px-6">
        <AnimatePresence mode="wait">
          {/* Welcome */}
          {step === "welcome" && (
            <motion.div key="welcome" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl gradient-accent flex items-center justify-center glow-accent mx-auto">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">
                  Find your <span className="text-gradient">perfect spot</span>
                </h1>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Answer a few quick questions and we'll match you with the best restaurants for tonight.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full max-w-xs mx-auto h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                onClick={next}
              >
                Let's go <Sparkles className="w-4 h-4 ml-2" />
              </Button>
              <button onClick={() => navigate("/explore")} className="text-xs text-muted-foreground">
                Back to Explore
              </button>
            </motion.div>
          )}

          {/* Occasion */}
          {step === "occasion" && (
            <motion.div key="occasion" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold mb-1">What's the occasion?</h2>
                <p className="text-sm text-muted-foreground">Pick one that fits</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {occasionOptions.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => { setOccasion(o.id); next(); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      occasion === o.id
                        ? "border-primary bg-primary/10 glow-accent-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${occasion === o.id ? "gradient-accent text-primary-foreground" : "bg-secondary text-foreground"}`}>
                      {o.icon}
                    </div>
                    <span className="text-sm font-semibold">{o.label}</span>
                    <span className="text-[10px] text-muted-foreground">{o.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cuisine */}
          {step === "cuisine" && (
            <motion.div key="cuisine" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold mb-1">What are you craving?</h2>
                <p className="text-sm text-muted-foreground">Pick as many as you like, or skip</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {cuisineOptions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCuisine(c.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                      cuisines.includes(c.id)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-xs font-semibold">{c.label}</span>
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                className="w-full h-12 gradient-accent text-primary-foreground rounded-2xl font-display font-bold"
                onClick={next}
              >
                {cuisines.length === 0 ? "Surprise me" : "Continue"}
              </Button>
            </motion.div>
          )}

          {/* Vibe */}
          {step === "vibe" && (
            <motion.div key="vibe" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold mb-1">What vibe tonight?</h2>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {vibeOptions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => toggleVibe(v.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                      vibes.includes(v.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                className="w-full h-12 gradient-accent text-primary-foreground rounded-2xl font-display font-bold"
                onClick={next}
              >
                {vibes.length === 0 ? "Any vibe" : "Continue"}
              </Button>
            </motion.div>
          )}

          {/* Budget */}
          {step === "budget" && (
            <motion.div key="budget" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold mb-1">What's your budget?</h2>
                <p className="text-sm text-muted-foreground">Pick one or more</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {budgetOptions.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => toggleBudget(b.id)}
                    className={`flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all ${
                      budget.includes(b.id)
                        ? "border-primary bg-primary/10 glow-accent-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xl font-display font-bold">{b.id}</span>
                    <span className="text-xs text-muted-foreground">{b.desc}</span>
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                className="w-full h-12 gradient-accent text-primary-foreground rounded-2xl font-display font-bold"
                onClick={generateResults}
              >
                Find my restaurants <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Loading */}
          {step === "loading" && (
            <motion.div key="loading" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full gradient-accent flex items-center justify-center glow-accent animate-pulse">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold mb-1">Finding your perfect spots…</h2>
                <p className="text-sm text-muted-foreground">Matching restaurants to your taste</p>
              </div>
              <div className="w-48 h-1.5 bg-secondary rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full gradient-accent rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4 }}
                />
              </div>
            </motion.div>
          )}

          {/* Results */}
          {step === "results" && (
            <motion.div key="results" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="space-y-5 -mx-2">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-display font-bold">Your matches</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {results.length} restaurant{results.length !== 1 ? "s" : ""} picked for you
                </p>
              </div>

              <div className="space-y-4 px-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                {results.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={r.coverImage}
                        alt={r.name}
                        className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-display font-bold text-sm truncate pr-2">{r.name}</h3>
                            {i === 0 && (
                              <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full gradient-accent text-primary-foreground">
                                TOP PICK
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{r.cuisine} · {r.priceRange}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-primary fill-primary" /> {r.rating}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" /> {r.distance}
                            </span>
                            <span className={`font-semibold ${r.isOpen ? "text-emerald-400" : "text-destructive"}`}>
                              {r.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => navigate(`/restaurant-view/${r.id}`)}
                            className="flex-1 py-1.5 rounded-lg bg-secondary text-[11px] font-semibold text-center"
                          >
                            Menu
                          </button>
                          <button
                            onClick={() => setReserveTarget(r)}
                            className="flex-1 py-1.5 rounded-lg gradient-accent text-primary-foreground text-[11px] font-bold text-center"
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 px-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl"
                  onClick={() => {
                    setStep("welcome");
                    setOccasion(null);
                    setCuisines([]);
                    setVibes([]);
                    setBudget([]);
                  }}
                >
                  Start over
                </Button>
                <Button
                  className="flex-1 rounded-2xl gradient-accent text-primary-foreground font-bold"
                  onClick={() => navigate("/explore")}
                >
                  Back to Explore
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {reserveTarget && (
        <ReservationSheet
          open={!!reserveTarget}
          onClose={() => setReserveTarget(null)}
          restaurant={reserveTarget}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default SmartExplore;
