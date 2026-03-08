import { categories } from "@/data/menuData";

interface Props {
  active: string;
  onChange: (id: string) => void;
}

const CategoryNav = ({ active, onChange }: Props) => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onChange(cat.id)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          active === cat.id
            ? "gradient-accent text-primary-foreground glow-accent-sm"
            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
);

export default CategoryNav;
