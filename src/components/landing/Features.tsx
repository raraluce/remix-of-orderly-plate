import { Zap, BarChart3, Globe, Shield, Palette, Bell } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Setup", desc: "Upload your menu and get a QR code in minutes. No hardware needed." },
  { icon: BarChart3, title: "Live Analytics", desc: "Track orders, revenue, and popular dishes in real-time dashboards." },
  { icon: Globe, title: "Multi-Language", desc: "Auto-translate menus for international guests with one click." },
  { icon: Shield, title: "Secure Payments", desc: "PCI-compliant payment processing with fraud protection built in." },
  { icon: Palette, title: "Custom Branding", desc: "Match your restaurant's style with customizable themes and logos." },
  { icon: Bell, title: "Kitchen Alerts", desc: "Real-time order notifications direct to your kitchen display system." },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Everything you need to <span className="text-gradient">modernize dining</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
