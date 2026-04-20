import { useState } from "react";
import { QrCode, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";
import { sessionService } from "@/services/sessionService";

const statusStyles: Record<string, { bg: string; dot: string; label: string }> = {
  open: { bg: "bg-emerald-500/10 border-emerald-500/30", dot: "bg-emerald-500", label: "Open" },
  occupied: { bg: "bg-primary/10 border-primary/30", dot: "bg-primary", label: "Occupied" },
  settling: { bg: "bg-amber-500/10 border-amber-500/30", dot: "bg-amber-500", label: "Settling" },
  closed: { bg: "bg-secondary border-border", dot: "bg-muted-foreground", label: "Closed" },
};

const TablesQR = () => {
  const { restaurantId, restaurant } = useRestaurantConfig();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["restaurant-tables", restaurantId],
    queryFn: () => sessionService.getTablesByRestaurant(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: activeSession } = useQuery({
    queryKey: ["table-active-session", selectedId],
    queryFn: () => sessionService.findActiveSession(selectedId!),
    enabled: !!selectedId,
  });

  const selected = tables.find((t: any) => t.id === selectedId);
  const participants = (activeSession as any)?.session_participants ?? [];

  const joinUrl = restaurant && selected
    ? `${window.location.origin}/join/${restaurant.slug}/${selected.id}`
    : "";

  return (
    <div className="p-6 grid lg:grid-cols-[1fr,360px] gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Tables & QR Codes</h1>
            <p className="text-sm text-muted-foreground">{tables.length} tables · tap to view QR</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading tables…
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {tables.map((t: any) => {
              const s = statusStyles[t.status] ?? statusStyles.closed;
              const isSel = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`p-4 rounded-2xl border text-center transition-all hover:scale-[1.02] ${s.bg} ${isSel ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{s.label}</p>
                  </div>
                  <p className="font-display font-bold text-lg">{t.label}</p>
                  {t.capacity && <p className="text-[10px] text-muted-foreground">Cap. {t.capacity}</p>}
                </button>
              );
            })}
            {tables.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8 text-sm">No tables yet</p>
            )}
          </div>
        )}
      </div>

      {/* Detail */}
      <div className="bg-card border border-border rounded-2xl p-5 h-fit">
        {!selected ? (
          <div className="text-center py-12">
            <QrCode className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Select a table to see its QR code and active session</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Table</p>
              <h2 className="text-xl font-display font-bold">{selected.label}</h2>
            </div>

            <div className="aspect-square bg-white rounded-xl flex items-center justify-center p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`}
                alt={`QR for table ${selected.label}`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-[10px] text-muted-foreground break-all bg-secondary rounded-lg p-2 font-mono">
              {joinUrl}
            </div>

            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => navigator.clipboard.writeText(joinUrl)}
            >
              Copy Link
            </Button>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-display font-bold">Active Session</h3>
              </div>
              {!activeSession ? (
                <p className="text-xs text-muted-foreground">No active session at this table.</p>
              ) : (
                <div className="space-y-2">
                  {participants.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{p.display_name || (p.is_guest ? "Guest" : "Diner")}</span>
                      <span className="text-muted-foreground">
                        {new Date(p.joined_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesQR;
