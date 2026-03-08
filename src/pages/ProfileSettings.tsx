import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Bell,
  BellOff,
  Globe,
  CreditCard,
  Shield,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Trash2,
  MapPin,
  HelpCircle,
  FileText,
  MessageSquare,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Check,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppUser } from "@/contexts/AppUserContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/app/BottomNav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ── Types ── */
type SettingsSection = null | "account" | "notifications" | "privacy" | "payment" | "appearance" | "language";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

/* ── Reusable row ── */
const SettingsRow = ({
  icon: Icon,
  label,
  description,
  onClick,
  trailing,
  destructive,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
      destructive ? "hover:bg-destructive/10" : "hover:bg-secondary"
    }`}
  >
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        destructive ? "bg-destructive/10" : "bg-primary/10"
      }`}
    >
      <Icon className={`w-4.5 h-4.5 ${destructive ? "text-destructive" : "text-primary"}`} />
    </div>
    <div className="flex-1 text-left min-w-0">
      <p className={`text-sm font-medium ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</p>
      {description && <p className="text-[11px] text-muted-foreground truncate">{description}</p>}
    </div>
    {trailing ?? <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
  </button>
);

/* ── Main Component ── */
const ProfileSettings = () => {
  const navigate = useNavigate();
  const { isAppUser, setAppUser } = useAppUser();
  const { toast } = useToast();

  const [section, setSection] = useState<SettingsSection>(null);

  // Account state
  const [name, setName] = useState("Jamie Doe");
  const [email, setEmail] = useState("jamie@bite.app");
  const [phone, setPhone] = useState("+1 555 012 3456");

  // Notification state
  const [pushOrders, setPushOrders] = useState(true);
  const [pushPromos, setPushPromos] = useState(true);
  const [pushReservations, setPushReservations] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  // Privacy state
  const [locationSharing, setLocationSharing] = useState(true);
  const [orderHistory, setOrderHistory] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  // Appearance state
  const [darkMode, setDarkMode] = useState(true);

  // Language state
  const [language, setLanguage] = useState("en");

  const handleSave = (label: string) => {
    toast({ title: "Saved", description: `${label} updated successfully.` });
    setSection(null);
  };

  const handleLogout = () => {
    setAppUser(false);
    toast({ title: "Signed out" });
    navigate("/");
  };

  /* ── Sub-screens ── */
  const renderSubScreen = () => {
    switch (section) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12 rounded-xl bg-card border-border" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-xl bg-card border-border" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Phone
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-12 rounded-xl bg-card border-border" />
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/forgot-password")}
              variant="outline"
              className="w-full h-12 rounded-xl border-border"
            >
              <Lock className="w-4 h-4 mr-2" /> Change Password
            </Button>

            <Button
              className="w-full h-12 gradient-accent text-primary-foreground rounded-xl font-display font-bold glow-accent-sm"
              onClick={() => handleSave("Account details")}
            >
              Save Changes
            </Button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Push Notifications</p>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Order updates</p>
                <p className="text-[11px] text-muted-foreground">Status changes, ready for pickup</p>
              </div>
              <Switch checked={pushOrders} onCheckedChange={setPushOrders} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Promotions & offers</p>
                <p className="text-[11px] text-muted-foreground">Deals from your favorite spots</p>
              </div>
              <Switch checked={pushPromos} onCheckedChange={setPushPromos} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Reservations</p>
                <p className="text-[11px] text-muted-foreground">Reminders & confirmations</p>
              </div>
              <Switch checked={pushReservations} onCheckedChange={setPushReservations} />
            </div>

            <div className="h-px bg-border my-3" />

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Email</p>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Weekly digest</p>
                <p className="text-[11px] text-muted-foreground">Summary of your dining activity</p>
              </div>
              <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
            </div>

            <div className="px-4 pt-4">
              <Button
                className="w-full h-12 gradient-accent text-primary-foreground rounded-xl font-display font-bold glow-accent-sm"
                onClick={() => handleSave("Notification preferences")}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Location sharing</p>
                <p className="text-[11px] text-muted-foreground">Show nearby restaurants</p>
              </div>
              <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Visible order history</p>
                <p className="text-[11px] text-muted-foreground">Let restaurants see past orders</p>
              </div>
              <Switch checked={orderHistory} onCheckedChange={setOrderHistory} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Personalized suggestions</p>
                <p className="text-[11px] text-muted-foreground">Based on your dining patterns</p>
              </div>
              <Switch checked={personalizedAds} onCheckedChange={setPersonalizedAds} />
            </div>

            <div className="h-px bg-border my-3" />

            <div className="px-4 space-y-3 pt-2">
              <Button variant="outline" className="w-full h-12 rounded-xl border-border text-sm">
                <FileText className="w-4 h-4 mr-2" /> Download My Data
              </Button>
              <Button
                className="w-full h-12 gradient-accent text-primary-foreground rounded-xl font-display font-bold glow-accent-sm"
                onClick={() => handleSave("Privacy settings")}
              >
                Save Settings
              </Button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-4 px-4">
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-8 rounded-lg bg-primary/80 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                VISA
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-[11px] text-muted-foreground">Expires 08/27</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">Default</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-8 rounded-lg bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                MC
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">•••• •••• •••• 8371</p>
                <p className="text-[11px] text-muted-foreground">Expires 03/26</p>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-border text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4 mr-2" /> Add Payment Method
            </Button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-4 px-4">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setDarkMode(true)}
                className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${darkMode ? "bg-primary/10" : ""}`}
              >
                <Moon className="w-5 h-5 text-primary" />
                <span className="flex-1 text-left text-sm font-medium">Dark Mode</span>
                {darkMode && <Check className="w-4 h-4 text-primary" />}
              </button>
              <div className="h-px bg-border" />
              <button
                onClick={() => setDarkMode(false)}
                className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${!darkMode ? "bg-primary/10" : ""}`}
              >
                <Sun className="w-5 h-5 text-primary" />
                <span className="flex-1 text-left text-sm font-medium">Light Mode</span>
                {!darkMode && <Check className="w-4 h-4 text-primary" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Theme preference is saved automatically
            </p>
          </div>
        );

      case "language":
        return (
          <div className="space-y-1 px-4">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {LANGUAGES.map((lang, i) => (
                <div key={lang.code}>
                  {i > 0 && <div className="h-px bg-border" />}
                  <button
                    onClick={() => {
                      setLanguage(lang.code);
                      toast({ title: "Language updated", description: `Switched to ${lang.label}` });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${
                      language === lang.code ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="flex-1 text-left text-sm font-medium">{lang.label}</span>
                    {language === lang.code && <Check className="w-4 h-4 text-primary" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ── Section titles ── */
  const sectionTitles: Record<string, string> = {
    account: "Account",
    notifications: "Notifications",
    privacy: "Privacy & Data",
    payment: "Payment Methods",
    appearance: "Appearance",
    language: "Language",
  };

  return (
    <div className={`min-h-screen bg-background ${isAppUser ? "pb-24" : "pb-12"}`}>
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => (section ? setSection(null) : navigate("/profile"))}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg">
            {section ? sectionTitles[section] : "Settings"}
          </h1>
        </div>
      </header>

      <div className="container mx-auto max-w-lg py-4">
        <motion.div
          key={section ?? "main"}
          initial={{ opacity: 0, x: section ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {section ? (
            renderSubScreen()
          ) : (
            <div className="space-y-2">
              {/* Account Section */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">
                Account
              </p>
              <SettingsRow icon={User} label="Account Details" description="Name, email, password" onClick={() => setSection("account")} />
              <SettingsRow icon={CreditCard} label="Payment Methods" description="Cards & wallets" onClick={() => setSection("payment")} />

              <div className="h-px bg-border mx-4 my-2" />

              {/* Preferences */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">
                Preferences
              </p>
              <SettingsRow icon={Bell} label="Notifications" description="Push, email & reminders" onClick={() => setSection("notifications")} />
              <SettingsRow icon={Moon} label="Appearance" description={darkMode ? "Dark mode" : "Light mode"} onClick={() => setSection("appearance")} />
              <SettingsRow icon={Globe} label="Language" description={LANGUAGES.find((l) => l.code === language)?.label} onClick={() => setSection("language")} />

              <div className="h-px bg-border mx-4 my-2" />

              {/* Privacy & Support */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">
                Privacy & Support
              </p>
              <SettingsRow icon={Shield} label="Privacy & Data" description="Location, data sharing" onClick={() => setSection("privacy")} />
              <SettingsRow icon={HelpCircle} label="Help & Support" description="FAQs and contact us" onClick={() => toast({ title: "Coming soon" })} />
              <SettingsRow icon={FileText} label="Terms & Policies" description="Legal documents" onClick={() => toast({ title: "Coming soon" })} />

              <div className="h-px bg-border mx-4 my-2" />

              {/* Danger zone */}
              <SettingsRow icon={LogOut} label="Sign Out" destructive onClick={handleLogout} />
              <SettingsRow
                icon={Trash2}
                label="Delete Account"
                description="Permanently remove your data"
                destructive
                onClick={() => toast({ title: "Are you sure?", description: "This action cannot be undone.", variant: "destructive" })}
              />

              {/* Version */}
              <p className="text-center text-[10px] text-muted-foreground pt-6 pb-2">
                .bite v1.0.0
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {isAppUser && <BottomNav />}
    </div>
  );
};

export default ProfileSettings;
