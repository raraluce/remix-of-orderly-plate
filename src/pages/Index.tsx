import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Benefits from "@/components/landing/Benefits";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => (
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

export default Index;
