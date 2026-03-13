import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Trash2,
  HelpCircle,
  FileText,
  Smartphone,
  Lock,
  Check,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppUser } from "@/contexts/AppUserContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/app/BottomNav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
  children?: React.ReactNode;
}) => {
  const content = (
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

  return children ? <>{children}</> : content;
};

/* ── Sub-screen components ── */
const AccountSection = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);

  const handleSave = () => {
    updateSettings({ name, email, phone });
    toast({ title: "Saved", description: "Account details updated successfully." });
  };

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
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </div>
  );
};

const NotificationsSection = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Push Notifications</p>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Order updates</p>
          <p className="text-[11px] text-muted-foreground">Status changes, ready for pickup</p>
        </div>
        <Switch checked={settings.pushOrders} onCheckedChange={(v) => updateSettings({ pushOrders: v })} />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Promotions & offers</p>
          <p className="text-[11px] text-muted-foreground">Deals from your favorite spots</p>
        </div>
        <Switch checked={settings.pushPromos} onCheckedChange={(v) => updateSettings({ pushPromos: v })} />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Reservations</p>
          <p className="text-[11px] text-muted-foreground">Reminders & confirmations</p>
        </div>
        <Switch checked={settings.pushReservations} onCheckedChange={(v) => updateSettings({ pushReservations: v })} />
      </div>

      <div className="h-px bg-border my-3" />

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Email</p>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Weekly digest</p>
          <p className="text-[11px] text-muted-foreground">Summary of your dining activity</p>
        </div>
        <Switch checked={settings.emailDigest} onCheckedChange={(v) => updateSettings({ emailDigest: v })} />
      </div>

      <div className="px-4 pt-4">
        <Button
          className="w-full h-12 gradient-accent text-primary-foreground rounded-xl font-display font-bold glow-accent-sm"
          onClick={() => toast({ title: "Saved", description: "Notification preferences updated." })}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

const PrivacySection = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Location sharing</p>
          <p className="text-[11px] text-muted-foreground">Show nearby restaurants</p>
        </div>
        <Switch checked={settings.locationSharing} onCheckedChange={(v) => updateSettings({ locationSharing: v })} />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Visible order history</p>
          <p className="text-[11px] text-muted-foreground">Let restaurants see past orders</p>
        </div>
        <Switch checked={settings.orderHistory} onCheckedChange={(v) => updateSettings({ orderHistory: v })} />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">Personalized suggestions</p>
          <p className="text-[11px] text-muted-foreground">Based on your dining patterns</p>
        </div>
        <Switch checked={settings.personalizedAds} onCheckedChange={(v) => updateSettings({ personalizedAds: v })} />
      </div>

      <div className="h-px bg-border my-3" />

      <div className="px-4 space-y-3 pt-2">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-border text-sm"
          onClick={() => toast({ title: "Download started", description: "Your data export will be ready shortly." })}
        >
          <FileText className="w-4 h-4 mr-2" /> Download My Data
        </Button>
        <Button
          className="w-full h-12 gradient-accent text-primary-foreground rounded-xl font-display font-bold glow-accent-sm"
          onClick={() => toast({ title: "Saved", description: "Privacy settings updated." })}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

const PaymentSection = () => {
  const { settings, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useSettings();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [newLast4, setNewLast4] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [newType, setNewType] = useState<"visa" | "mastercard" | "amex">("visa");

  const handleAdd = () => {
    if (newLast4.length !== 4 || !/^\d{4}$/.test(newLast4)) {
      toast({ title: "Invalid card", description: "Enter the last 4 digits." });
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(newExpiry)) {
      toast({ title: "Invalid expiry", description: "Use MM/YY format." });
      return;
    }
    addPaymentMethod({
      type: newType,
      last4: newLast4,
      expiry: newExpiry,
      isDefault: settings.paymentMethods.length === 0,
    });
    setNewLast4("");
    setNewExpiry("");
    setShowAdd(false);
    toast({ title: "Card added", description: `•••• ${newLast4} saved.` });
  };

  const typeLabel: Record<string, string> = { visa: "VISA", mastercard: "MC", amex: "AMEX" };

  return (
    <div className="space-y-4 px-4">
      {settings.paymentMethods.map((pm) => (
        <div key={pm.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-8 rounded-lg bg-primary/80 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            {typeLabel[pm.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">•••• •••• •••• {pm.last4}</p>
            <p className="text-[11px] text-muted-foreground">Expires {pm.expiry}</p>
          </div>
          <div className="flex items-center gap-2">
            {pm.isDefault ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">Default</span>
            ) : (
              <button
                onClick={() => {
                  setDefaultPaymentMethod(pm.id);
                  toast({ title: "Default updated" });
                }}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                Set default
              </button>
            )}
            <button
              onClick={() => {
                removePaymentMethod(pm.id);
                toast({ title: "Card removed" });
              }}
              className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        </div>
      ))}

      {settings.paymentMethods.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">No payment methods saved</p>
      )}

      {showAdd ? (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Card</p>
          <div className="grid grid-cols-3 gap-2">
            {(["visa", "mastercard", "amex"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setNewType(t)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  newType === t ? "gradient-accent text-primary-foreground glow-accent-sm" : "bg-secondary text-muted-foreground"
                }`}
              >
                {typeLabel[t]}
              </button>
            ))}
          </div>
          <Input
            placeholder="Last 4 digits"
            value={newLast4}
            onChange={(e) => setNewLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            className="h-11 rounded-xl bg-secondary border-border"
          />
          <Input
            placeholder="MM/YY"
            value={newExpiry}
            onChange={(e) => {
              let v = e.target.value.replace(/[^\d/]/g, "");
              if (v.length === 2 && !v.includes("/") && newExpiry.length < v.length) v += "/";
              setNewExpiry(v.slice(0, 5));
            }}
            maxLength={5}
            className="h-11 rounded-xl bg-secondary border-border"
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="flex-1 h-11 rounded-xl gradient-accent text-primary-foreground font-bold" onClick={handleAdd}>Add Card</Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-dashed border-border text-sm text-muted-foreground"
          onClick={() => setShowAdd(true)}
        >
          <CreditCard className="w-4 h-4 mr-2" /> Add Payment Method
        </Button>
      )}
    </div>
  );
};

const AppearanceSection = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4 px-4">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <button
          onClick={() => updateSettings({ darkMode: true })}
          className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${settings.darkMode ? "bg-primary/10" : ""}`}
        >
          <Moon className="w-5 h-5 text-primary" />
          <span className="flex-1 text-left text-sm font-medium">Dark Mode</span>
          {settings.darkMode && <Check className="w-4 h-4 text-primary" />}
        </button>
        <div className="h-px bg-border" />
        <button
          onClick={() => updateSettings({ darkMode: false })}
          className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${!settings.darkMode ? "bg-primary/10" : ""}`}
        >
          <Sun className="w-5 h-5 text-primary" />
          <span className="flex-1 text-left text-sm font-medium">Light Mode</span>
          {!settings.darkMode && <Check className="w-4 h-4 text-primary" />}
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        Theme preference is saved automatically
      </p>
    </div>
  );
};

const LanguageSection = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  return (
    <div className="space-y-1 px-4">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {LANGUAGES.map((lang, i) => (
          <div key={lang.code}>
            {i > 0 && <div className="h-px bg-border" />}
            <button
              onClick={() => {
                updateSettings({ language: lang.code });
                toast({ title: "Language updated", description: `Switched to ${lang.label}` });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${
                settings.language === lang.code ? "bg-primary/10" : ""
              }`}
            >
              <span className="flex-1 text-left text-sm font-medium">{lang.label}</span>
              {settings.language === lang.code && <Check className="w-4 h-4 text-primary" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const ProfileSettings = () => {
  const navigate = useNavigate();
  const { isAppUser, setAppUser } = useAppUser();
  const { settings, resetSettings } = useSettings();
  const { toast } = useToast();

  const [section, setSection] = useState<SettingsSection>(null);

  const handleLogout = () => {
    setAppUser(false);
    toast({ title: "Signed out" });
    navigate("/");
  };

  const handleDeleteAccount = () => {
    resetSettings();
    setAppUser(false);
    toast({ title: "Account deleted", description: "All your data has been removed." });
    navigate("/");
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

  const renderSubScreen = () => {
    switch (section) {
      case "account": return <AccountSection />;
      case "notifications": return <NotificationsSection />;
      case "privacy": return <PrivacySection />;
      case "payment": return <PaymentSection />;
      case "appearance": return <AppearanceSection />;
      case "language": return <LanguageSection />;
      default: return null;
    }
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
              <SettingsRow icon={User} label="Account Details" description={`${settings.name} · ${settings.email}`} onClick={() => setSection("account")} />
              <SettingsRow icon={CreditCard} label="Payment Methods" description="Cards & wallets" onClick={() => setSection("payment")} />

              <div className="h-px bg-border mx-4 my-2" />

              {/* Preferences */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">
                Preferences
              </p>
              <SettingsRow icon={Bell} label="Notifications" description="Push, email & reminders" onClick={() => setSection("notifications")} />
              <SettingsRow icon={Moon} label="Appearance" description={settings.darkMode ? "Dark mode" : "Light mode"} onClick={() => setSection("appearance")} />
              <SettingsRow icon={Globe} label="Language" description={LANGUAGES.find((l) => l.code === settings.language)?.label} onClick={() => setSection("language")} />

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

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors hover:bg-destructive/10">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-destructive/10">
                      <Trash2 className="w-4.5 h-4.5 text-destructive" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-destructive">Delete Account</p>
                      <p className="text-[11px] text-muted-foreground truncate">Permanently remove your data</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your data, order history, preferences, and saved payment methods will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
