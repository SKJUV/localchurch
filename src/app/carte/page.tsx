"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase";
import { CellCard } from "@/components/carte/CellCard";
import { Loader2, MapPin, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

// Default center: Douala, Cameroun
const DEFAULT_LAT = 4.0511;
const DEFAULT_LNG = 9.7679;

// Dynamically import the InteractiveMap component
const InteractiveMap = dynamic(() => import("@/components/carte/InteractiveMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/50 animate-pulse">
      Chargement de la carte...
    </div>
  )
});

export default function CartePage() {
  const supabase = createClient();
  const [userLocation, setUserLocation] = useState<[number, number]>([DEFAULT_LAT, DEFAULT_LNG]);
  const [cells, setCells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  const fetchNearestCells = useCallback(async (lat: number, lng: number) => {
    setSearching(true);
    try {
      const { data, error } = await (supabase.rpc as any)('trouver_fi_proches', {
        lat,
        lng,
        rayon_km: 50
      });

      if (error) throw error;
      
      const cellsData = data;
      setCells(cellsData || []);
      if (cellsData && cellsData.length > 0) {
        setSelectedCellId(cellsData[0].id);
      }
    } catch (err: any) {
      console.error("Erreur lors de la recherche des FI:", err);
      toast.error("Impossible de charger les Familles d'Impact");
    } finally {
      setSearching(false);
      setLoading(false);
    }
  }, [supabase]);

  // Initial geoloc
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearestCells(latitude, longitude);
        },
        (error) => {
          console.warn("Géolocalisation refusée ou indisponible:", error);
          fetchNearestCells(DEFAULT_LAT, DEFAULT_LNG);
        }
      );
    } else {
      fetchNearestCells(DEFAULT_LAT, DEFAULT_LNG);
    }
  }, [fetchNearestCells]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setUserLocation([lat, lng]);
        fetchNearestCells(lat, lng);
        toast.success("Position mise à jour");
      } else {
        toast.error("Adresse introuvable");
      }
    } catch (err) {
      toast.error("Erreur de recherche");
    } finally {
      setSearching(false);
    }
  };

  const handleManualLocationUpdate = (pos: [number, number]) => {
    setUserLocation(pos);
    fetchNearestCells(pos[0], pos[1]);
  };

  const handleJoinCell = (id: string) => {
    // This will be implemented in a future sprint (affectation workflow)
    toast.info("Votre demande de participation a été transmise au responsable de cellule. (Simulation)");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Sidebar: Search and Results */}
      <div className="w-full md:w-[420px] lg:w-[450px] flex flex-col border-r bg-background shadow-xl z-10 shrink-0">
        <div className="p-6 space-y-8 h-full flex flex-col">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Trouver ma Cellule</h1>
            <p className="text-muted-foreground">
              Voici les Familles d&apos;Impact les plus proches de vous.
            </p>
          </div>

          <div className="space-y-3">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                placeholder="Quartier, rue ou ville..." 
                className="pl-10 pr-24 h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all shadow-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <Button 
                  type="submit" 
                  size="sm" 
                  className="rounded-lg h-9 px-4 font-semibold"
                  disabled={searching}
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rechercher"}
                </Button>
              </div>
            </form>

            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl font-medium"
              onClick={() => {
                 if (navigator.geolocation) {
                   navigator.geolocation.getCurrentPosition((pos) => {
                     handleManualLocationUpdate([pos.coords.latitude, pos.coords.longitude]);
                   });
                 }
              }}
            >
              <Navigation className="w-4 h-4" />
              Utiliser ma position actuelle
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 pt-4 custom-scrollbar">
            {searching ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/40" />
                <p className="font-medium">Recherche des cellules de proximité...</p>
              </div>
            ) : cells.length > 0 ? (
              <div className="grid gap-5 py-2">
                {cells.map((cell, index) => (
                  <div 
                    key={cell.id} 
                    id={`cell-${cell.id}`}
                    onMouseEnter={() => setSelectedCellId(cell.id)}
                    className="animate-in slide-in-from-bottom-4 duration-300 fill-mode-both"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CellCard
                      {...cell}
                      isRecommended={index === 0}
                      onSelect={handleJoinCell}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-8 rounded-[2rem] bg-gradient-to-b from-muted/30 to-transparent border-2 border-dashed border-muted-foreground/20 animate-in zoom-in-95 duration-500">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                  <div className="relative bg-background w-20 h-20 rounded-full flex items-center justify-center shadow-inner border border-muted">
                    <MapPin className="w-10 h-10 text-primary/60" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3">Aucune FI à proximité</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aucun groupe n&apos;a été identifié dans un rayon de 50 km autour de cette position. 
                  <br /><br />
                  <span className="text-primary font-medium">Conseil :</span> Essayez de déplacer le curseur sur la carte ou de rechercher une autre localité.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Map */}
      <div className="flex-1 relative">
        <InteractiveMap 
          userLocation={userLocation}
          setUserLocation={handleManualLocationUpdate}
          cells={cells}
          selectedCellId={selectedCellId}
          onCellSelect={setSelectedCellId}
        />
        
        {/* Hint overlay refined */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 px-6 py-3 bg-secondary/90 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/10 text-xs sm:text-sm font-medium pointer-events-none transition-all hover:opacity-0 hidden md:flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Cliquez n&apos;importe où sur la carte pour relancer la recherche</span>
        </div>
      </div>
    </div>
  );
}
