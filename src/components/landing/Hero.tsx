import { Link } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFood from "@/assets/hero-food.jpg";
import appMockup from "@/assets/app-mockup.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroFood} alt="Gourmet food" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm text-muted-foreground animate-fade-up">
              <span className="w-2 h-2 rounded-full gradient-accent" />
              The future of dining is here
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-800 leading-[0.95] tracking-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Scan. Order.{" "}
              <span className="text-gradient">Enjoy.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Transform your restaurant with QR-powered digital menus, seamless ordering, and instant payments. No app downloads. No waiting.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/menu">
                <Button size="lg" className="gradient-accent text-primary-foreground rounded-full px-8 text-base font-semibold glow-accent hover:scale-105 transition-transform">
                  Try the Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-border text-foreground hover:bg-secondary">
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div>
                <p className="text-2xl font-display font-bold text-gradient">500+</p>
                <p className="text-xs text-muted-foreground">Restaurants</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-display font-bold text-gradient">2M+</p>
                <p className="text-xs text-muted-foreground">Orders Served</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-display font-bold text-gradient">4.9★</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" />
              <img
                src={appMockup}
                alt="bite. app mockup"
                className="relative w-80 rounded-3xl shadow-2xl animate-float"
              />
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-xl animate-scale-in" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Order Placed!</p>
                    <p className="text-xs text-muted-foreground">Table 7 • $48.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
