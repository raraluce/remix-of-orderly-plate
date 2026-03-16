import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Users, Percent, Check, Receipt, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";

const tipOptions = [
  { label: "No tip", value: 0 },
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
];

const DISCOUNT_CODES: Record<string, { label: string; percent: number }> = {
  BITE20: { label: "BITE20 — 20% off", percent: 0.2 },
};

type SplitMode = "equal" | "by-dish";

const Payment = () => {
  const { items, total } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [tipPercent, setTipPercent] = useState(0.15);
  const [splitCount, setSplitCount] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [customTip, setCustomTip] = useState("");
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);

  // Discount
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; label: string; percent: number } | null>(null);
  const [discountError, setDiscountError] = useState("");

  const handleApplyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    const match = DISCOUNT_CODES[code];
    if (match) {
      setAppliedDiscount({ code, ...match });
      setDiscountError("");
      setDiscountInput("");
    } else {
      setDiscountError("Invalid discount code");
    }
  };

  const discountAmount = appliedDiscount ? total * appliedDiscount.percent : 0;
  const discountedTotal = total - discountAmount;
  const serviceFee = discountedTotal * 0.05;
  const tipAmount = customTip ? parseFloat(customTip) || 0 : discountedTotal * tipPercent;
  const grandTotal = discountedTotal + serviceFee + tipAmount;
  const perPerson = grandTotal / splitCount;

  // By-dish calculations
  const selectedDishTotal = items
    .filter((i) => selectedDishIds.includes(i.id))
    .reduce((sum, i) => sum + i.price * i.quantity, 0);
  const selectedAfterDiscount = appliedDiscount ? selectedDishTotal * (1 - appliedDiscount.percent) : selectedDishTotal;
  const selectedDishShare = selectedAfterDiscount + selectedAfterDiscount * 0.05 + (customTip ? (parseFloat(customTip) || 0) * (selectedAfterDiscount / (discountedTotal || 1)) : selectedAfterDiscount * tipPercent);

  const toggleDish = (id: string) => {
    setSelectedDishIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate("/order-confirmation");
    }, 1800);
  };

  const payAmount = splitMode === "equal"
    ? (splitCount > 1 ? perPerson : grandTotal)
    : selectedDishShare;

  const defaultCard = settings.paymentMethods.find((m) => m.isDefault);
  const typeLabel: Record<string, string> = { visa: "Visa", mastercard: "Mastercard", amex: "Amex" };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No items in cart</p>
          <Link to="/menu">
            <Button className="gradient-accent text-primary-foreground rounded-full">Go to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/menu" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">Payment</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
        {/* Order Summary */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 animate-fade-up">
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">Order Summary</h2>
          {items.map((item) => {
            const unitPrice = item.price + (item.customisations?.priceAdjustment ?? 0);
            return (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.quantity}× {item.name}</span>
                <span className="font-semibold">${(unitPrice * item.quantity).toFixed(2)}</span>
              </div>
              {item.customisations && (
                <div className="text-[11px] text-muted-foreground pl-4 space-y-0.5">
                  {item.customisations.removedIngredients.length > 0 && (
                    <p>− {item.customisations.removedIngredients.join(", ")}</p>
                  )}
                  {item.customisations.addedExtras.length > 0 && (
                    <p>+ {item.customisations.addedExtras.join(", ")}</p>
                  )}
                  {item.customisations.cookingPoint && (
                    <p>🔥 {item.customisations.cookingPoint}</p>
                  )}
                </div>
              )}
            </div>
            );
          })}
          <div className="border-t border-border pt-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-500">Discount ({appliedDiscount.code})</span>
              <span className="font-semibold text-emerald-500">−${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service fee</span>
            <span className="font-semibold">${serviceFee.toFixed(2)}</span>
          </div>
        </div>

        {/* Discount Code */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-sm">Discount Code</h2>
          </div>
          {appliedDiscount ? (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-500">{appliedDiscount.label}</span>
              </div>
              <button onClick={() => setAppliedDiscount(null)} className="p-1 rounded-full hover:bg-secondary transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={discountInput}
                onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(""); }}
                className="flex-1 h-11 rounded-xl bg-secondary border-border uppercase"
              />
              <Button onClick={handleApplyDiscount} variant="outline" className="h-11 rounded-xl px-5 font-semibold">
                Apply
              </Button>
            </div>
          )}
          {discountError && <p className="text-xs text-destructive">{discountError}</p>}
        </div>

        {/* Tip Selection */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-sm">Add a Tip</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tipOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setTipPercent(opt.value); setCustomTip(""); }}
                className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tipPercent === opt.value && !customTip
                    ? "gradient-accent text-primary-foreground glow-accent-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Custom:</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input
                type="number"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="0.00"
                className="w-full bg-secondary border border-border rounded-xl pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tip amount</span>
            <span className="font-semibold text-primary">${tipAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Bill Split */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-sm">Split the Bill</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSplitMode("equal")}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                splitMode === "equal"
                  ? "gradient-accent text-primary-foreground glow-accent-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Split evenly
            </button>
            <button
              onClick={() => setSplitMode("by-dish")}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                splitMode === "by-dish"
                  ? "gradient-accent text-primary-foreground glow-accent-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Pay by dish
            </button>
          </div>

          {splitMode === "equal" && (
            <>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSplitCount(n)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      splitCount === n
                        ? "gradient-accent text-primary-foreground glow-accent-sm"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n === 1 ? "Just me" : `${n}`}
                  </button>
                ))}
              </div>
              {splitCount > 1 && (
                <p className="text-sm text-muted-foreground text-center">
                  Each person pays <span className="text-primary font-display font-bold">${perPerson.toFixed(2)}</span>
                </p>
              )}
            </>
          )}

          {splitMode === "by-dish" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Select the dishes you're paying for:</p>
              {items.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedDishIds.includes(item.id)
                      ? "bg-primary/10 border-primary/30"
                      : "bg-secondary border-border hover:border-border/80"
                  }`}
                >
                  <Checkbox
                    checked={selectedDishIds.includes(item.id)}
                    onCheckedChange={() => toggleDish(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.quantity}× {item.name}</p>
                  </div>
                  <span className="text-sm font-display font-bold text-primary shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </label>
              ))}
              {selectedDishIds.length > 0 && (
                <div className="pt-2 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">Your dishes + fees</span>
                  <span className="font-display font-bold text-primary">${selectedDishShare.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Total & Pay */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex justify-between font-display font-bold text-xl">
            <span>Total</span>
            <span className="text-gradient">${grandTotal.toFixed(2)}</span>
          </div>
          {splitMode === "equal" && splitCount > 1 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Your share ({splitCount} people)</span>
              <span className="font-semibold text-foreground">${perPerson.toFixed(2)}</span>
            </div>
          )}
          {splitMode === "by-dish" && selectedDishIds.length > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Your dishes ({selectedDishIds.length} items)</span>
              <span className="font-semibold text-foreground">${selectedDishShare.toFixed(2)}</span>
            </div>
          )}

          {/* Selected payment card */}
          <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">•••• •••• •••• {defaultCard?.last4 ?? "4242"}</p>
              <p className="text-[11px] text-muted-foreground">{defaultCard ? typeLabel[defaultCard.type] ?? "Card" : "Visa"}</p>
            </div>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>

          <Button
            className="w-full gradient-accent text-primary-foreground rounded-full py-6 text-base font-semibold glow-accent disabled:opacity-60"
            onClick={handlePay}
            disabled={processing || (splitMode === "by-dish" && selectedDishIds.length === 0)}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" /> Pay ${payAmount.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
