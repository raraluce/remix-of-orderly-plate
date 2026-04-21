import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroFood from "@/assets/hero-food.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[88vh] flex items-end pt-16 overflow-hidden">
      {/* Hero photography — full bleed */}
      <div className="absolute inset-0 z-0">
        <img src={heroFood} alt="An evening service in progress" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-20">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-lowest/80 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-foreground/80 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            The Editorial Table
          </div>

          <h1
            className="font-display text-6xl md:text-8xl text-foreground leading-[0.95] tracking-tight animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Scan. Order.{" "}
            <span className="italic text-primary">Linger.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-body font-light animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            A digitally curated dining experience for restaurants who treat hospitality as a craft.
            No app downloads. No friction. Only flavour.
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/register">
              <Button
                size="lg"
                className="gradient-accent text-primary-foreground rounded-full px-8 h-14 text-sm font-body font-semibold tracking-[0.1em] uppercase glow-accent editorial-shadow"
              >
                Begin
                <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
              </Button>
            </Link>
            <Link to="/explore">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-sm font-body font-medium tracking-wide border-foreground/15 bg-surface-lowest/60 backdrop-blur-md text-foreground hover:bg-surface-lowest"
              >
                Explore restaurants
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <p className="text-3xl font-display italic text-primary">500+</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body font-medium">Restaurants</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-display italic text-primary">2M+</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body font-medium">Orders served</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-display italic text-primary">4.9</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body font-medium">Avg rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
