import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sessionService } from "@/services/sessionService";
import { menuService } from "@/services/menuService";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type JoinStep =
  | "loading"
  | "error-closed"
  | "error-not-found"
  | "error-generic";

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
        // 1) Ensure the user has a session — sign in anonymously if needed
        let currentUser = user;
        if (!currentUser) {
          await signInAsGuest();
          // Wait for auth state to propagate
          const { data: { session } } = await supabase.auth.getSession();
          currentUser = session?.user ?? null;
          if (!currentUser) {
            throw new Error("Failed to create guest session");
          }
        }

        // 2) Look up restaurant by slug
        const restaurant = await menuService.getRestaurantBySlug(restaurantSlug);
        if (!restaurant) {
          setStep("error-not-found");
          setErrorMsg("We couldn't find this restaurant.");
          return;
        }

        // 3) Look up the table
        let table;
        try {
          table = await sessionService.getTable(tableId);
        } catch {
          setStep("error-not-found");
          setErrorMsg("This table doesn't exist.");
          return;
        }

        // Verify it belongs to this restaurant
        if (table.restaurant_id !== restaurant.id) {
          setStep("error-not-found");
          setErrorMsg("This table doesn't belong to this restaurant.");
          return;
        }

        // 4) Check table status — if closed, show friendly message
        if (table.status === "closed") {
          setStep("error-closed");
          return;
        }

        // 5) Find an existing active session or create one
        const existingSession = await sessionService.findActiveSession(tableId);
        const sessionId = existingSession
          ? existingSession.id
          : (await sessionService.createSession(tableId, restaurant.id)).id;

        // 6) Check if user is already a participant
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

        // 7) Redirect to menu with session context
        navigate(`/menu?session=${sessionId}&restaurant=${restaurant.id}&table=${table.label}`, {
          replace: true,
        });
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-lg font-display font-semibold text-foreground">Opening your table…</p>
        <p className="text-sm text-muted-foreground text-center">
          Setting everything up so you can start ordering
        </p>
      </div>
    );
  }

  if (step === "error-closed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <XCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold mb-2">Table not available</h1>
          <p className="text-sm text-muted-foreground">
            This table is currently closed. Please ask a member of staff to open it for you.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")} className="mt-4">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <div>
        <h1 className="text-xl font-display font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          {errorMsg || "We couldn't set up your table. Please try scanning the QR code again."}
        </p>
      </div>
      <Button variant="outline" onClick={() => { setStarted(false); setStep("loading"); }} className="mt-4">
        Try Again
      </Button>
    </div>
  );
};

export default JoinTable;
