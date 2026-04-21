import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sessionService } from "@/services/sessionService";
import { menuService } from "@/services/menuService";
import { Button } from "@/components/ui/button";

type JoinStep = "loading" | "error-closed" | "error-not-found" | "error-generic";

const JoinTable = () => {
  const { restaurantSlug, tableId } = useParams<{ restaurantSlug: string; tableId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, signInAsGuest } = useAuth();
  const [step, setStep] = useState<JoinStep>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (authLoading || started) return;
    if (!restaurantSlug || !tableId) {
      setStep("error-not-found");
      return;
    }

    const run = async () => {
      setStarted(true);
      try {
        let currentUser = user;
        if (!currentUser) {
          await signInAsGuest();
          const { data: { session } } = await supabase.auth.getSession();
          currentUser = session?.user ?? null;
          if (!currentUser) throw new Error("Failed to create guest session");
        }

        const restaurant = await menuService.getRestaurantBySlug(restaurantSlug);
        if (!restaurant) {
          setStep("error-not-found");
          setErrorMsg("We couldn't find this restaurant.");
          return;
        }

        let table;
        try {
          table = await sessionService.getTable(tableId);
        } catch {
          setStep("error-not-found");
          setErrorMsg("This table doesn't exist.");
          return;
        }

        if (table.restaurant_id !== restaurant.id) {
          setStep("error-not-found");
          setErrorMsg("This table doesn't belong to this restaurant.");
          return;
        }

        if (table.status === "closed") {
          setStep("error-closed");
          return;
        }

        const existingSession = await sessionService.findActiveSession(tableId);
        const sessionId = existingSession
          ? existingSession.id
          : (await sessionService.createSession(tableId, restaurant.id)).id;

        const participants = await sessionService.getParticipants(sessionId);
        const alreadyJoined = participants.some((p) => p.user_id === currentUser!.id);

        if (!alreadyJoined) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", currentUser.id)
            .single();
          const displayName = profile?.display_name || "Guest";
          await sessionService.joinSession(sessionId, displayName, currentUser.id);
        }

        navigate(`/menu?session=${sessionId}&restaurant=${restaurant.id}&table=${table.label}`, { replace: true });
      } catch (err: any) {
        console.error("Join table error:", err);
        setStep("error-generic");
        setErrorMsg(err?.message || "Something went wrong. Please try again.");
      }
    };

    run();
  }, [authLoading, user, restaurantSlug, tableId, started]);

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-6 paper-grain">
        <div className="text-center space-y-3">
          <h1 className="font-display italic text-5xl text-primary">bite.</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body font-medium">
            The Editorial Table
          </p>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-primary animate-spin" />
        <div className="text-center max-w-xs space-y-1">
          <p className="font-display italic text-2xl text-foreground">Opening your table…</p>
          <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">
            A seat is being prepared just for you
          </p>
        </div>
      </div>
    );
  }

  if (step === "error-closed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-low flex items-center justify-center">
          <span className="material-symbols-outlined text-muted-foreground text-[28px]">do_not_disturb_on</span>
        </div>
        <div className="space-y-2 max-w-xs">
          <h1 className="text-3xl font-display italic">Table not available</h1>
          <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">
            This table is closed. Please ask a member of staff to open it for you.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")} className="rounded-full px-8 h-12 mt-4">
          Back home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-destructive text-[28px]">error</span>
      </div>
      <div className="space-y-2 max-w-xs">
        <h1 className="text-3xl font-display italic">Something went wrong</h1>
        <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">
          {errorMsg || "We couldn't set up your table. Please try scanning the QR code again."}
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => { setStarted(false); setStep("loading"); }}
        className="rounded-full px-8 h-12 mt-4"
      >
        Try again
      </Button>
    </div>
  );
};

export default JoinTable;
