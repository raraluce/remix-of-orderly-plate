interface CategoryItem {
  id: string;
  name: string;
}

interface Props {
  active: string;
  onChange: (id: string) => void;
  categories?: CategoryItem[];
}

const CategoryNav = ({ active, onChange, categories }: Props) => {
  const cats = categories && categories.length > 0
    ? [{ id: "all", name: "All" }, ...categories]
    : [{ id: "all", name: "All" }];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
      {cats.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 whitespace-nowrap px-6 py-3 rounded-full text-sm font-body font-medium transition-all duration-200 ${
            active === cat.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
              : "bg-surface-high text-foreground hover:bg-surface-highest"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
