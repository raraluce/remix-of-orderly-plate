import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden gradient-accent p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Ready to transform your restaurant?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join 500+ restaurants already using bite. to delight their guests.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" className="bg-background text-foreground hover:bg-secondary rounded-full px-8 text-base font-semibold">
                  Try the Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Restaurant Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
