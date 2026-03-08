import { Users, Store, TrendingUp, Clock, Star, Wallet } from "lucide-react";

const dinerBenefits = [
  { icon: Clock, title: "No More Waiting", desc: "Order and pay from your phone — skip the queue for the check" },
  { icon: Star, title: "Visual Menus", desc: "See every dish before you order with beautiful food photography" },
  { icon: Wallet, title: "Easy Splitting", desc: "Split the bill with friends in seconds, tip digitally" },
];

const restaurantBenefits = [
  { icon: TrendingUp, title: "30% More Revenue", desc: "Upselling prompts and faster table turnover boost your bottom line" },
  { icon: Users, title: "Happier Guests", desc: "Better experience = more repeat customers and better reviews" },
  { icon: Store, title: "Lower Costs", desc: "Reduce printing costs and staffing needs with digital ordering" },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Benefits</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            A win for <span className="text-gradient">everyone</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> For Diners
            </h3>
            {dinerBenefits.map((b, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{b.title}</h4>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> For Restaurants
            </h3>
            {restaurantBenefits.map((b, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{b.title}</h4>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
