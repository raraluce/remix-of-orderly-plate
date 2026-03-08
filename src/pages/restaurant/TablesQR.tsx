import { useState } from "react";
import { QrCode, Users, Wifi, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTables, mockSessions } from "@/services/mockData";
import type { Table } from "@/types";

const statusStyles: Record<Table["status"], { bg: string; dot: string; label: string }> = {
  available: { bg: "border-border bg-card", dot: "bg-emerald-500", label: "Available" },
  occupied: { bg: "border-primary/30 bg-primary/5", dot: "bg-primary", label: "Occupied" },
  reserved: { bg: "border-amber-500/30 bg-amber-500/5", dot: "bg-amber-500", label: "Reserved" },
  cleaning: { bg: "border-border bg-card opacity-60", dot: "bg-muted-foreground", label: "Cleaning" },
};

const TablesQR = () => {
  const [tables, setTables] = useState(mockTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const session = selectedTable?.currentSessionId
    ? mockSessions.find((s) => s.id === selectedTable.currentSessionId)
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Tables & QR Codes</h1>
          <p className="text-sm text-muted-foreground">
            {tables.filter((t) => t.status === "occupied").length} occupied · {tables.filter((t) => t.status === "available").length} available
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Table Grid */}
        <div>
          <h2 className="font-display font-semibold text-sm mb-3">Floor Plan</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {tables.map((table) => {
              const st = statusStyles[table.status];
              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all hover:scale-105 ${st.bg} ${
                    selectedTable?.id === table.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <p className="font-display font-bold text-lg">{table.number}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span className="text-[10px] text-muted-foreground">{st.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{table.capacity} seats</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Detail */}
        <div>
          {selectedTable ? (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 animate-scale-in">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">Table {selectedTable.number}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  statusStyles[selectedTable.status].bg
                }`}>
                  {statusStyles[selectedTable.status].label}
                </span>
              </div>

              {/* QR Code placeholder */}
              <div className="bg-secondary rounded-2xl p-8 flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-foreground/10 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-foreground/30" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {selectedTable.qrCode}
                </p>
                <Button size="sm" variant="outline" className="rounded-full text-xs">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Download QR
                </Button>
              </div>

              {/* Session info */}
              {session && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold">Active Session</span>
                  </div>
                  <div className="space-y-2">
                    {session.users.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 bg-secondary rounded-xl p-3">
                        <div className={`w-8 h-8 rounded-full ${u.avatarColor} flex items-center justify-center text-xs font-bold text-primary-foreground`}>
                          {u.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {u.isHost ? "Host" : "Guest"} · Joined {new Date(u.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Capacity: {selectedTable.capacity} seats · ID: {selectedTable.id}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center text-center">
              <QrCode className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Select a table to view details & QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablesQR;
