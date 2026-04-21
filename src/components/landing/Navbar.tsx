import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-0">
          <span className="font-display italic text-3xl text-primary leading-none">bite</span>
          <span className="font-display italic text-3xl text-foreground leading-none">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-[13px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#benefits" className="text-[13px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          <Link to="/login" className="text-[13px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
          <Link to="/restaurant" className="text-[13px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">For restaurants</Link>
          <Link to="/register">
            <Button className="gradient-accent text-primary-foreground rounded-full px-6 font-medium tracking-wide glow-accent-sm">
              Get started
            </Button>
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border/30 animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            <a href="#features" className="text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>How it works</a>
            <a href="#benefits" className="text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>Benefits</a>
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm py-2 text-muted-foreground">Sign in</Link>
            <Link to="/restaurant" onClick={() => setOpen(false)} className="text-sm py-2 text-muted-foreground">For restaurants</Link>
            <Link to="/register" onClick={() => setOpen(false)}>
              <Button className="gradient-accent text-primary-foreground rounded-full w-full font-medium">Get started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
