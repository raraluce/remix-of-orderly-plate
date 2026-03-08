import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, Check, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RestaurantListing } from "@/data/restaurants";
import { consumerPatternService } from "@/services/consumerPatternService";

interface ReservationSheetProps {
  open: boolean;
  onClose: () => void;
  restaurant: RestaurantListing;
}

const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const ReservationSheet = ({ open, onClose, restaurant }: ReservationSheetProps) => {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState("20:00");

  // Get learned user profile (using mock user-1)
  const userProfile = consumerPatternService.getUserProfile("user-1");

  const handleConfirm = () => setStep("confirmed");
  const handleClose = () => { setStep("form"); onClose(); };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en", { month: "short" }),
    };
  });

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="font-display text-lg">
            {step === "confirmed" ? "Reservation Confirmed" : `Reserve at ${restaurant.name}`}
          </SheetTitle>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pb-6"
            >
              {/* Guests */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Users className="w-4 h-4 text-primary" /> Guests
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {guestOptions.map((n) => (
                    <button
                      key={n}
                      onClick={() => setGuests(n)}
                      className={`w-11 h-11 rounded-xl text-sm font-bold flex-shrink-0 transition-all ${
                        guests === n
                          ? "gradient-accent text-primary-foreground glow-accent-sm"
                          : "bg-secondary text-foreground"
                      }`}
                    >{n}</button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Calendar className="w-4 h-4 text-primary" /> Date
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px] flex-shrink-0 transition-all ${
                        selectedDate === d.value
                          ? "gradient-accent text-primary-foreground glow-accent-sm"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <span className="text-[10px] font-medium opacity-70">{d.day}</span>
                      <span className="text-lg font-bold leading-tight">{d.date}</span>
                      <span className="text-[10px] font-medium opacity-70">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Clock className="w-4 h-4 text-primary" /> Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        selectedTime === t
                          ? "gradient-accent text-primary-foreground glow-accent-sm"
                          : "bg-secondary text-foreground"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
                onClick={handleConfirm}
              >
                Confirm Reservation
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6 space-y-4"
            >
              <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center glow-accent">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl mb-1">You're all set!</h3>
                <p className="text-muted-foreground text-sm">
                  Table for {guests} at {restaurant.name}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold">
                    {new Date(selectedDate).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-semibold">{guests}</span>
                </div>
              </div>

              {/* Learned user preferences */}
              {userProfile && userProfile.totalOrders >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-xs"
                >
                  <div className="bg-card border border-primary/20 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="font-display font-bold text-sm">Your dining profile</h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Based on your last {userProfile.totalOrders} visits
                    </p>

                    {userProfile.topPreferences.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">You usually enjoy</p>
                        <div className="flex flex-wrap gap-1.5">
                          {userProfile.topPreferences.slice(0, 3).map((p) => (
                            <span key={p.preference} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold capitalize">
                              {p.preference}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {userProfile.frequentPairings.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground">Your favourite combos</p>
                        {userProfile.frequentPairings.slice(0, 2).map((pair, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <TrendingUp className="w-3 h-3 text-primary shrink-0" />
                            <span className="text-foreground">
                              {pair.dishName} <span className="text-muted-foreground">+</span> {pair.pairedWith}
                            </span>
                            <span className="ml-auto text-[10px] text-muted-foreground">{pair.count}×</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground italic">
                      Avg. spend: ${userProfile.averageSpend.toFixed(0)} per visit
                    </p>
                  </div>
                </motion.div>
              )}

              <Button variant="outline" className="rounded-2xl" onClick={handleClose}>
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

export default ReservationSheet;
