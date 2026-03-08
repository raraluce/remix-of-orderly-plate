import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { menuItems as initialItems, categories as initialCategories, type MenuItem, allergenLabels, pairingTagLabels } from "@/data/menuData";
import DishFormSheet from "@/components/restaurant/DishFormSheet";

const MenuManagement = () => {
  const [dishes, setDishes] = useState<MenuItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState("all");
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredDishes = activeCategory === "all" ? dishes : dishes.filter((d) => d.category === activeCategory);

  const handleDelete = (id: string) => setDishes((prev) => prev.filter((d) => d.id !== id));

  const handleSave = (dish: MenuItem) => {
    setDishes((prev) => {
      const exists = prev.find((d) => d.id === dish.id);
      if (exists) return prev.map((d) => (d.id === dish.id ? dish : d));
      return [...prev, dish];
    });
    setEditingDish(null);
  };

  const openAdd = () => { setEditingDish(null); setShowForm(true); };
  const openEdit = (dish: MenuItem) => { setEditingDish(dish); setShowForm(true); };

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/restaurant" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-lg">Menu Management</h1>
              <p className="text-xs text-muted-foreground">{dishes.length} dishes</p>
            </div>
          </div>
          <Button size="sm" className="gradient-accent text-primary-foreground rounded-full font-semibold text-xs" onClick={openAdd}>
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
              activeCategory === "all" ? "gradient-accent text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >All</button>
          {initialCategories.filter((c) => c.id !== "popular").map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id ? "gradient-accent text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >{cat.label}</button>
          ))}
        </div>

        {/* Dish List */}
        <div className="space-y-2">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:border-primary/20 transition-colors group"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/40 hidden sm:block mt-4" />
              <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-sm truncate">{dish.name}</h4>
                  {dish.tags?.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-primary/10 text-primary">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground truncate">{dish.description}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[11px] text-muted-foreground capitalize">{dish.category}</span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="text-[11px] text-muted-foreground">{dish.portionSize}{dish.type === "drink" ? "ml" : "g"}</span>
                  {dish.allergens.length > 0 && (
                    <>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <div className="flex gap-1 flex-wrap">
                        {dish.allergens.map((a) => (
                          <Badge key={a} variant="outline" className="text-[9px] px-1.5 py-0 border-destructive/30 text-destructive">{allergenLabels[a]}</Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {dish.pairingTags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-1">
                    {dish.pairingTags.map((p) => (
                      <span key={p} className="px-1.5 py-0.5 text-[9px] rounded-full bg-accent text-accent-foreground">{pairingTagLabels[p]}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 mt-2">
                <span className="font-display font-bold text-primary text-sm">${dish.price.toFixed(2)}</span>
                <button onClick={() => openEdit(dish)} className="p-1.5 rounded-full hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(dish.id)} className="p-1.5 rounded-full hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DishFormSheet open={showForm} onOpenChange={setShowForm} dish={editingDish} onSave={handleSave} />
    </div>
  );
};

export default MenuManagement;
