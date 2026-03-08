import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Salad, Fish, Drumstick, Leaf, Sparkles, Zap, Users, ChevronRight, Plus, Eye, Brain, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { generateRecommendations, type UserPreferences, type TableRecommendation } from "@/lib/recommendationEngine";
import { type Allergen, type FoodPreference, type HungerLevel, dietaryTagLabels } from "@/data/menuData";
import FloatingCart from "@/components/menu/FloatingCart";
import CartSheet from "@/components/menu/CartSheet";

const STEPS = ["welcome", "dietary", "preference", "hunger", "table", "loading", "results"] as const;
type Step = typeof STEPS[number];

const pageVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const allergenOptions: { id: Allergen; label: string; emoji: string }[] = [
  { id: "gluten", label: "Gluten free", emoji: "🌾" },
  { id: "dairy", label: "Lactose free", emoji: "🥛" },
  { id: "nuts", label: "Nut allergy", emoji: "🥜" },
  { id: "eggs", label: "Egg allergy", emoji: "🥚" },
  { id: "soy", label: "Soy allergy", emoji: "🫘" },
  { id: "fish", label: "Fish allergy", emoji: "🐟" },
  { id: "crustaceans", label: "Crustacean allergy", emoji: "🦐" },
  { id: "molluscs", label: "Mollusc allergy", emoji: "🐚" },
];

const preferenceOptions: { id: FoodPreference; label: string; icon: React.ReactNode }[] = [
  { id: "meat", label: "Meat", icon: <Drumstick className="w-5 h-5" /> },
  { id: "fish", label: "Fish", icon: <Fish className="w-5 h-5" /> },
  { id: "vegetarian", label: "Vegetarian", icon: <Salad className="w-5 h-5" /> },
  { id: "vegan", label: "Vegan", icon: <Leaf className="w-5 h-5" /> },
  { id: "surprise", label: "Surprise me", icon: <Sparkles className="w-5 h-5" /> },
];

const hungerOptions: { id: HungerLevel; label: string; emoji: string; desc: string }[] = [
  { id: "light", label: "Light meal", emoji: "🥗", desc: "Just a bite" },
  { id: "normal", label: "Normal meal", emoji: "🍽️", desc: "Standard appetite" },
  { id: "hungry", label: "Very hungry", emoji: "🍔", desc: "Feed me everything" },
  { id: "sharing", label: "Sharing with the table", emoji: "🤝", desc: "Family style" },
];

const mockTableUsers = [
  { name: "You", initials: "YO", color: "gradient-accent" },
  { name: "Guest 2", initials: "G2", color: "bg-emerald-600" },
  { name: "Guest 3", initials: "G3", color: "bg-violet-600" },
];

const SmartMenu = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [step, setStep] = useState<Step>("welcome");
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [preference, setPreference] = useState<FoodPreference | null>(null);
  const [hunger, setHunger] = useState<HungerLevel | null>(null);
  const [tableSize, setTableSize] = useState(1);
  const [recommendation, setRecommendation] = useState<TableRecommendation | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const goNext = (next: Step) => setStep(next);

  const toggleAllergen = (a: Allergen) =>
    setAllergens((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleGenerate = () => {
    setStep("loading");
    const users: UserPreferences[] = Array.from({ length: tableSize }, () => ({
      allergens,
      preference: preference || "surprise",
      hungerLevel: hunger || "normal",
    }));
    setTimeout(() => {
      setRecommendation(generateRecommendations(users));
      setStep("results");
    }, 1800);
  };

  const handleAddToOrder = (item: { id: string; name: string; price: number; image: string }) => {
    addItem(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {step !== "welcome" && step !== "loading" && step !== "results" && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-secondary">
          <motion.div
            className="h-full gradient-accent"
            initial={{ width: "0%" }}
            animate={{
              width: step === "dietary" ? "25%" : step === "preference" ? "50%" : step === "hunger" ? "75%" : "90%",
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* WELCOME */}
        {step === "welcome" && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          >
            <div className="w-20 h-20 rounded-3xl gradient-accent flex items-center justify-center mb-8 glow-accent">
              <Utensils className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">
              Welcome to <span className="text-gradient">.bite</span>
            </h1>
            <p className="text-muted-foreground text-base mb-10 max-w-xs">
              Get personalized food recommendations in seconds.
            </p>
            <div className="w-full max-w-xs space-y-3">
              <Button
                size="lg"
                className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                onClick={() => goNext("dietary")}
              >
                <Sparkles className="w-5 h-5 mr-2" /> Start
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14 rounded-2xl font-display font-semibold text-sm"
                onClick={() => navigate("/menu")}
              >
                Browse menu without personalization
              </Button>
            </div>
          </motion.div>
        )}

        {/* DIETARY RESTRICTIONS */}
        {step === "dietary" && (
          <motion.div
            key="dietary"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col px-6 pt-14 pb-6"
          >
            <button onClick={() => goNext("welcome")} className="self-start mb-6 text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-display font-bold mb-2">
              Do you have any dietary restrictions?
            </h2>
            <p className="text-muted-foreground text-sm mb-8">Select all that apply, or skip.</p>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {allergenOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleAllergen(opt.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    allergens.includes(opt.id)
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-semibold text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
            <Button
              size="lg"
              className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base mt-6"
              onClick={() => goNext("preference")}
            >
              Continue <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        )}

        {/* FOOD PREFERENCE */}
        {step === "preference" && (
          <motion.div
            key="preference"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col px-6 pt-14 pb-6"
          >
            <button onClick={() => goNext("dietary")} className="self-start mb-6 text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-display font-bold mb-2">
              What type of food do you prefer today?
            </h2>
            <p className="text-muted-foreground text-sm mb-8">Pick one.</p>
            <div className="space-y-3 flex-1">
              {preferenceOptions.filter((o) => o.id !== "surprise").map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setPreference(opt.id);
                    goNext("hunger");
                  }}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    preference === opt.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
                    {opt.icon}
                  </div>
                  <span className="font-display font-bold text-base">{opt.label}</span>
                </button>
              ))}

              <div className="pt-2">
                <p className="text-xs text-muted-foreground text-center mb-2">Can't decide?</p>
                <button
                  onClick={() => {
                    setPreference("surprise");
                    goNext("hunger");
                  }}
                  className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-primary gradient-accent text-primary-foreground transition-all duration-200 glow-accent-sm"
                >
                  <Sparkles className="w-6 h-6" />
                  <span className="font-display font-bold text-lg">Surprise me!</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* HUNGER LEVEL */}
        {step === "hunger" && (
          <motion.div
            key="hunger"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col px-6 pt-14 pb-6"
          >
            <button onClick={() => goNext("preference")} className="self-start mb-6 text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-display font-bold mb-2">
              How hungry are you?
            </h2>
            <p className="text-muted-foreground text-sm mb-8">This helps us pick the right amount.</p>
            <div className="space-y-3 flex-1">
              {hungerOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setHunger(opt.id);
                    goNext("table");
                  }}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    hunger === opt.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div>
                    <p className="font-display font-bold text-base">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TABLE DETECTION */}
        {step === "table" && (
          <motion.div
            key="table"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col px-6 pt-14 pb-6"
          >
            <button onClick={() => goNext("hunger")} className="self-start mb-6 text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-display font-bold mb-2">
              People at this table
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Others who scanned the QR will appear here.
            </p>

            <div className="space-y-3 mb-8">
              {mockTableUsers.slice(0, tableSize).map((user, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl"
                >
                  <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-sm font-bold text-primary-foreground`}>
                    {user.initials}
                  </div>
                  <span className="font-semibold text-sm">{user.name}</span>
                  {i === 0 && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      Host
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {tableSize < 3 && (
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl mb-4 border-dashed"
                onClick={() => setTableSize((s) => Math.min(s + 1, 3))}
              >
                <Users className="w-4 h-4 mr-2" /> Simulate another guest joining
              </Button>
            )}

            <div className="mt-auto">
              <Button
                size="lg"
                className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                onClick={handleGenerate}
              >
                <Brain className="w-5 h-5 mr-2" /> Generate recommendations
              </Button>
            </div>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              className="w-20 h-20 rounded-3xl gradient-accent flex items-center justify-center mb-8 glow-accent"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Brain className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h2 className="text-xl font-display font-bold mb-2">Analyzing preferences…</h2>
            <p className="text-muted-foreground text-sm">
              Building the perfect menu for {tableSize > 1 ? `${tableSize} guests` : "you"}.
            </p>
          </motion.div>
        )}

        {/* RESULTS */}
        {step === "results" && recommendation && (
          <motion.div
            key="results"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-28"
          >
            <h2 className="text-2xl font-display font-bold mb-1">
              Recommended for your table
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Curated by <span className="text-gradient font-bold">.bite AI</span>
            </p>

            {/* Group optimization */}
            {tableSize > 1 && (
              <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-sm">Balanced recommendation for everyone</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {recommendation.starters.length > 0 && (
                    <p>• {recommendation.starters.length} starter{recommendation.starters.length > 1 ? "s" : ""} to share</p>
                  )}
                  <p>• {recommendation.mains.length} main dish{recommendation.mains.length > 1 ? "es" : ""}</p>
                  {recommendation.sides.length > 0 && (
                    <p>• {recommendation.sides.length} side{recommendation.sides.length > 1 ? "s" : ""}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 mt-3 italic">
                  Based on the preferences of {tableSize} guests at this table.
                </p>
              </div>
            )}

            {/* Why we recommend */}
            <div className="bg-secondary/50 rounded-2xl p-4 mb-6 flex gap-3">
              <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-xs mb-1">Why we recommend this</p>
                <p className="text-xs text-muted-foreground">{recommendation.explanation}</p>
              </div>
            </div>

            {/* Dish sections */}
            {[
              { title: "Starters", items: recommendation.starters },
              { title: "Mains", items: recommendation.mains },
              { title: "Sides", items: recommendation.sides },
              { title: "Desserts", items: recommendation.desserts },
              { title: "Drinks", items: recommendation.drinks },
            ]
              .filter((s) => s.items.length > 0)
              .map((section) => (
                <div key={section.title} className="mb-6">
                  <h3 className="font-display font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="bg-card border border-border rounded-2xl overflow-hidden"
                      >
                        <div className="flex gap-4 p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display font-bold text-sm">{item.name}</h4>
                              <span className="font-display font-bold text-primary text-sm shrink-0">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.dietaryTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] font-bold uppercase"
                                >
                                  {dietaryTagLabels[tag]}
                                </span>
                              ))}
                              {item.shareable && (
                                <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary text-[9px] font-bold uppercase">
                                  Shareable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {expandedItem === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border overflow-hidden"
                            >
                              <div className="p-4 text-xs text-muted-foreground space-y-2">
                                <p>{item.description}</p>
                                {item.allergens.length > 0 && (
                                  <p>
                                    <span className="font-bold text-destructive">Allergens:</span>{" "}
                                    {item.allergens.join(", ")}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex gap-2 px-4 pb-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-xl text-xs h-9"
                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            {expandedItem === item.id ? "Hide" : "Details"}
                          </Button>
                          <Button
                            size="sm"
                            className={`flex-1 rounded-xl text-xs h-9 ${addedItemId === item.id ? "bg-emerald-600 text-primary-foreground" : "gradient-accent text-primary-foreground"}`}
                            onClick={() => handleAddToOrder({ id: item.id, name: item.name, price: item.price, image: item.image })}
                          >
                            {addedItemId === item.id ? (
                              <><Check className="w-3.5 h-3.5 mr-1" /> Added!</>
                            ) : (
                              <><Plus className="w-3.5 h-3.5 mr-1" /> Add to order</>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

            {/* Bottom actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 glass">
              <div className="flex gap-3 max-w-lg mx-auto">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl font-display font-semibold"
                  onClick={() => navigate("/menu")}
                >
                  Browse full menu
                </Button>
                <Button
                  className="flex-1 h-12 gradient-accent text-primary-foreground rounded-2xl font-display font-bold glow-accent-sm"
                  onClick={() => navigate("/payment")}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step === "results" && (
        <>
          <FloatingCart onClick={() => setCartOpen(true)} />
          <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => navigate("/payment")} />
        </>
      )}
    </div>
  );
};

export default SmartMenu;
