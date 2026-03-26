"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Home } from "lucide-react";
import { renderToString } from "react-dom/server";

// Custom icons
const createUserIcon = () => {
  if (typeof window === 'undefined') return null;
  return L.divIcon({
    html: renderToString(<div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg border-2 border-white"><Home className="w-5 h-5" /></div>),
    className: "user-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createCellIcon = (isSelected: boolean) => {
  if (typeof window === 'undefined') return null;
  return L.divIcon({
    html: renderToString(
      <div className={`p-1.5 rounded-full shadow-md border-2 border-white transition-all transform ${isSelected ? 'bg-orange-500 text-white scale-125 z-[1000]' : 'bg-white text-orange-500'}`}>
        <MapPin className="w-5 h-5" fill="currentColor" />
      </div>
    ),
    className: "cell-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface InteractiveMapProps {
  userLocation: [number, number];
  setUserLocation: (pos: [number, number]) => void;
  cells: any[];
  selectedCellId: string | null;
  onCellSelect: (id: string) => void;
}

function MapEvents({ setUserLocation }: { setUserLocation: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function InteractiveMap({ 
  userLocation, 
  setUserLocation, 
  cells, 
  selectedCellId, 
  onCellSelect 
}: InteractiveMapProps) {
  const userIcon = useMemo(() => createUserIcon(), []);

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapEvents setUserLocation={setUserLocation} />
      <ChangeView center={userLocation} />

      {/* User Location Marker */}
      {userIcon && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Votre position de recherche</Popup>
        </Marker>
      )}

      {/* Cells Markers */}
      {cells.map((cell) => (
        <Marker 
          key={cell.id} 
          position={[cell.lat_reunion, cell.lng_reunion]} 
          icon={createCellIcon(cell.id === selectedCellId)!}
          eventHandlers={{
            click: () => onCellSelect(cell.id),
          }}
        >
          <Popup>
            <div className="font-bold">{cell.nom_famille}</div>
            <div className="text-xs text-muted-foreground">{cell.adresse_reunion}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
