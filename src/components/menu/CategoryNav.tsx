interface CategoryItem {
  id: string;
  name: string;
}

interface Props {
  active: string;
  onChange: (id: string) => void;
  categories?: CategoryItem[];
}

const defaultCategories: CategoryItem[] = [
  { id: "all", name: "All" },
];

const CategoryNav = ({ active, onChange, categories }: Props) => {
  const cats = categories && categories.length > 0
    ? [{ id: "all", name: "All" }, ...categories]
    : defaultCategories;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {cats.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat.id
              ? "gradient-accent text-primary-foreground glow-accent-sm"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
