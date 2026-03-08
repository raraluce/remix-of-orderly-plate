import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  type MenuItem, type Allergen, type PairingTag,
  allergenLabels, pairingTagLabels,
  categories as allCategories,
} from "@/data/menuData";

const allergenKeys = Object.keys(allergenLabels) as Allergen[];
const pairingKeys = Object.keys(pairingTagLabels) as PairingTag[];
const typeOptions: MenuItem["type"][] = ["starter", "main", "side", "dessert", "drink"];

interface DishFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish?: MenuItem | null;
  onSave: (dish: MenuItem) => void;
}

const emptyDish: Omit<MenuItem, "id"> = {
  name: "", description: "", price: 0, image: "", category: "mains",
  tags: [], allergens: [], dietaryTags: [], shareable: false,
  type: "main", preference: [], portionSize: 0, pairingTags: [],
};

const DishFormSheet = ({ open, onOpenChange, dish, onSave }: DishFormSheetProps) => {
  const [form, setForm] = useState<Omit<MenuItem, "id">>(emptyDish);

  useEffect(() => {
    if (dish) {
      const { id, ...rest } = dish;
      setForm(rest);
    } else {
      setForm({ ...emptyDish });
    }
  }, [dish, open]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const toggleInArray = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const saved: MenuItem = {
      id: dish?.id ?? `new-${Date.now()}`,
      ...form,
      image: form.image || "/placeholder.svg",
    };
    onSave(saved);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">{dish ? "Edit Dish" : "New Dish"}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 pt-6 pb-20">
          {/* Basic info */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-secondary border-border rounded-xl" />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
            <Input value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-secondary border-border rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price ($)</label>
              <Input type="number" step="0.01" value={form.price || ""} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} className="bg-secondary border-border rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Portion {form.type === "drink" ? "(ml)" : "(g)"}
              </label>
              <Input type="number" value={form.portionSize || ""} onChange={(e) => set("portionSize", parseInt(e.target.value) || 0)} className="bg-secondary border-border rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {allCategories.filter((c) => c.id !== "popular").map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as MenuItem["type"])}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary capitalize"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Allergens (EU14) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allergens (EU 14)</label>
            <div className="grid grid-cols-2 gap-2">
              {allergenKeys.map((a) => (
                <label key={a} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
                  <Checkbox
                    checked={form.allergens.includes(a)}
                    onCheckedChange={() => set("allergens", toggleInArray(form.allergens, a))}
                  />
                  <span className="text-xs font-medium">{allergenLabels[a]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pairing Metadata */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pairing Tags</label>
            <p className="text-[11px] text-muted-foreground -mt-1">Used to build recommendation relations (e.g. "meat → red wine")</p>
            <div className="flex flex-wrap gap-2">
              {pairingKeys.map((p) => {
                const active = form.pairingTags.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("pairingTags", toggleInArray(form.pairingTags, p))}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      active
                        ? "gradient-accent text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pairingTagLabels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shareable toggle */}
          <label className="flex items-center gap-3 px-3 py-3 rounded-xl bg-secondary cursor-pointer">
            <Checkbox checked={form.shareable} onCheckedChange={(v) => set("shareable", !!v)} />
            <span className="text-sm font-medium">Shareable dish</span>
          </label>

          <Button onClick={handleSave} className="w-full gradient-accent text-primary-foreground rounded-full font-semibold" disabled={!form.name || !form.price}>
            <Save className="w-4 h-4 mr-2" /> {dish ? "Update Dish" : "Save Dish"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DishFormSheet;
