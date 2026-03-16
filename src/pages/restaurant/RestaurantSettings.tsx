import { useState } from "react";
import { Save, Clock, Palette, Sparkles, Globe, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { mockRestaurant } from "@/services/mockData";
import { useRestaurantConfig, type PaymentModel } from "@/contexts/RestaurantConfigContext";

const RestaurantSettings = () => {
  const [name, setName] = useState(mockRestaurant.name);
  const [description, setDescription] = useState(mockRestaurant.description);
  const [address, setAddress] = useState(mockRestaurant.address);
  const [phone, setPhone] = useState(mockRestaurant.phone);
  const [serviceFee, setServiceFee] = useState(String(mockRestaurant.serviceFeePercent));
  const [aiEnabled, setAiEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const { config, updateConfig } = useRestaurantConfig();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold">Settings</h1>

      {/* Branding */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold">Restaurant Branding</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Restaurant Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border rounded-xl mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-secondary border border-border rounded-xl p-3 text-sm mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-secondary border-border rounded-xl mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary border-border rounded-xl mt-1" />
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold">Operations</h2>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Service Fee (%)</label>
          <Input
            type="number"
            value={serviceFee}
            onChange={(e) => setServiceFee(e.target.value)}
            className="bg-secondary border-border rounded-xl mt-1 w-32"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Opening Hours</p>
          {mockRestaurant.hours.map((h, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-20 text-muted-foreground">{h.day}</span>
              <span className="font-semibold">{h.open} — {h.close}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Model */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold">Payment Model</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Choose when your guests pay for their orders.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {([
            {
              value: "pay-now" as PaymentModel,
              title: "Pay Now",
              desc: "Guests pay at checkout before the order is sent to the kitchen.",
            },
            {
              value: "pay-later" as PaymentModel,
              title: "Pay Later",
              desc: "Guests order first and settle the bill at the end of the meal.",
            },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateConfig({ paymentModel: opt.value })}
              className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                config.paymentModel === opt.value
                  ? "gradient-accent text-primary-foreground border-transparent glow-accent-sm"
                  : "bg-secondary border-border text-foreground hover:border-border/80"
              }`}
            >
              <p className="text-sm font-semibold">{opt.title}</p>
              <p className={`text-[11px] mt-1 ${
                config.paymentModel === opt.value ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold">AI Features</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Smart Recommendations</p>
            <p className="text-xs text-muted-foreground">AI-powered food recommendations for guests</p>
          </div>
          <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
        </div>
        <div className="flex items-center justify-between opacity-50">
          <div>
            <p className="text-sm font-semibold">LLM Chat Assistant</p>
            <p className="text-xs text-muted-foreground">Coming soon — Natural language ordering</p>
          </div>
          <Switch disabled />
        </div>
        <div className="flex items-center justify-between opacity-50">
          <div>
            <p className="text-sm font-semibold">Multi-restaurant Panel</p>
            <p className="text-xs text-muted-foreground">Coming soon — Manage multiple locations</p>
          </div>
          <Switch disabled />
        </div>
      </div>

      <Button
        className="gradient-accent text-primary-foreground rounded-full px-8 font-semibold glow-accent-sm"
        onClick={handleSave}
      >
        <Save className="w-4 h-4 mr-2" />
        {saved ? "Saved!" : "Save Settings"}
      </Button>
    </div>
  );
};

export default RestaurantSettings;
