"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

// Fix for default marker icons if needed, but we use Lucide
const customIcon = typeof window !== 'undefined' ? L.divIcon({
  html: renderToString(<MapPin className="text-primary w-8 h-8 -mt-8 -ml-4" fill="currentColor" />),
  className: "custom-div-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
}) : null;

interface LeafletMapProps {
  center: [number, number];
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  onChange: (lat: number, lng: number) => void;
}

function MapEvents({ onChange, setPosition }: { onChange: (lat: number, lng: number) => void, setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange(lat, lng);
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

export default function LeafletMap({ center, position, setPosition, onChange }: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapEvents onChange={onChange} setPosition={setPosition} />
      <ChangeView center={center} />

      {position && customIcon && (
        <Marker position={position} icon={customIcon} />
      )}
    </MapContainer>
  );
}
