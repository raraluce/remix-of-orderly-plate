import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Benefits from "@/components/landing/Benefits";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    // Diagnostic: test DB read
    supabase
      .from("restaurants")
      .select("id, name, slug")
      .limit(5)
      .then(({ data, error }) => {
        if (error) {
          console.error("❌ Supabase DB read failed:", error.message);
        } else {
          console.log("✅ Supabase DB connected — restaurants:", data);
        }
      });

    // Diagnostic: test anonymous auth
    supabase.auth.signInAnonymously().then(({ data, error }) => {
      if (error) {
        console.error("❌ Anonymous auth failed:", error.message);
      } else {
        console.log("✅ Anonymous auth working — user id:", data.session?.user?.id);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
