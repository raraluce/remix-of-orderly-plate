import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { menuItems as initialItems, categories as initialCategories, type MenuItem } from "@/data/menuData";

interface EditableDish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags?: string[];
}

const MenuManagement = () => {
  const [dishes, setDishes] = useState<EditableDish[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [newDish, setNewDish] = useState({ name: "", description: "", price: "", category: "mains" });

  const filteredDishes = activeCategory === "all" ? dishes : dishes.filter((d) => d.category === activeCategory);

  const handleDelete = (id: string) => setDishes((prev) => prev.filter((d) => d.id !== id));

  const handlePriceEdit = (id: string, newPrice: number) => {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, price: newPrice } : d)));
    setEditingId(null);
  };

  const handleAddDish = () => {
    if (!newDish.name || !newDish.price) return;
    const dish: EditableDish = {
      id: `new-${Date.now()}`,
      name: newDish.name,
      description: newDish.description,
      price: parseFloat(newDish.price),
      category: newDish.category,
      image: initialItems[0].image,
      tags: ["New"],
    };
    setDishes((prev) => [...prev, dish]);
    setNewDish({ name: "", description: "", price: "", category: "mains" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-lg">Menu Management</h1>
              <p className="text-xs text-muted-foreground">{dishes.length} dishes</p>
            </div>
          </div>
          <Button
            size="sm"
            className="gradient-accent text-primary-foreground rounded-full font-semibold text-xs"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Dish
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-3xl">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "gradient-accent text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {initialCategories.filter((c) => c.id !== "popular").map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "gradient-accent text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Dish Form */}
        {showAdd && (
          <div className="bg-card border border-primary/30 rounded-2xl p-5 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">New Dish</h3>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-secondary rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Input
              placeholder="Dish name"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
              className="bg-secondary border-border rounded-xl"
            />
            <Input
              placeholder="Description"
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
              className="bg-secondary border-border rounded-xl"
            />
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Price"
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  className="bg-secondary border-border rounded-xl pl-7"
                />
              </div>
              <select
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                className="bg-secondary border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {initialCategories.filter((c) => c.id !== "popular").map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleAddDish} className="w-full gradient-accent text-primary-foreground rounded-full font-semibold">
              <Save className="w-4 h-4 mr-2" /> Save Dish
            </Button>
          </div>
        )}

        {/* Dish List */}
        <div className="space-y-2">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors group"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/40 hidden sm:block" />
              <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm truncate">{dish.name}</h4>
                  {dish.tags?.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-primary/10 text-primary">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground truncate">{dish.description}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{dish.category}</p>
              </div>

              {editingId === dish.id ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-20">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <input
                      type="number"
                      defaultValue={dish.price}
                      className="w-full bg-secondary border border-border rounded-lg pl-5 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePriceEdit(dish.id, parseFloat((e.target as HTMLInputElement).value));
                      }}
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-full hover:bg-secondary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-primary text-sm">${dish.price.toFixed(2)}</span>
                  <button
                    onClick={() => setEditingId(dish.id)}
                    className="p-1.5 rounded-full hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="p-1.5 rounded-full hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
