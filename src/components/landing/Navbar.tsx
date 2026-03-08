import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          <span className="text-gradient">bite</span>
          <span className="text-foreground">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
          </Link>
          <Link to="/restaurant">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Restaurant Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gradient-accent text-primary-foreground rounded-full px-6 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a href="#features" className="text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>How It Works</a>
            <a href="#benefits" className="text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>Benefits</a>
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">Sign In</Button>
            </Link>
            <Link to="/restaurant" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">Restaurant Login</Button>
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}>
              <Button size="sm" className="gradient-accent text-primary-foreground rounded-full w-full font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
