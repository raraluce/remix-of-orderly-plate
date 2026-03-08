import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-bold">
          <span className="text-gradient">bite</span><span className="text-foreground">.</span>
        </Link>
        <div className="flex gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <Link to="/menu" className="hover:text-foreground transition-colors">Demo</Link>
          <Link to="/restaurant" className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 bite. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
