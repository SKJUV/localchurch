"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Default center: Douala, Cameroun
const DEFAULT_LAT = 4.0511;
const DEFAULT_LNG = 9.7679;

// Dynamically import the LeafletMap component
const LeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-md border flex items-center justify-center bg-muted/50 text-muted-foreground animate-pulse">
      Chargement de la carte...
    </div>
  )
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );

  // Sync state if props change externally
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const center: [number, number] = position || [DEFAULT_LAT, DEFAULT_LNG];

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border relative z-0">
      <LeafletMap 
        center={center} 
        position={position} 
        setPosition={setPosition} 
        onChange={onChange} 
      />
      
      <div className="absolute top-2 left-2 z-[400] bg-background/90 backdrop-blur-sm p-2 rounded shadow-sm text-xs font-medium pointer-events-none border">
        Cliquez sur la carte pour définir votre position
      </div>
    </div>
  );
}
