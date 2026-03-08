import { QrCode, UtensilsCrossed, CreditCard, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: QrCode, title: "Scan QR Code", desc: "Point your phone camera at the table's QR code. Instantly opens the digital menu." },
  { icon: UtensilsCrossed, title: "Browse & Order", desc: "Explore the menu with beautiful food photos. Add items to your cart with one tap." },
  { icon: CreditCard, title: "Pay Instantly", desc: "Checkout securely from your phone. Split bills, tip, and go — no waiting for the check." },
  { icon: CheckCircle2, title: "Enjoy!", desc: "Your order goes straight to the kitchen. Track status in real-time." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Four steps to a <span className="text-gradient">better experience</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl gradient-accent flex items-center justify-center glow-accent-sm group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
