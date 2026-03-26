"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, User, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CellCardProps {
  id: string;
  nom_famille: string;
  adresse_reunion: string;
  jour_reunion: string;
  heure_reunion: string;
  distance_km: number;
  chef_nom: string;
  chef_telephone: string;
  onSelect: (id: string) => void;
  isRecommended?: boolean;
}

export function CellCard({
  id,
  nom_famille,
  adresse_reunion,
  jour_reunion,
  heure_reunion,
  distance_km,
  chef_nom,
  chef_telephone,
  onSelect,
  isRecommended = false,
}: CellCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${isRecommended ? 'border-primary ring-1 ring-primary/20' : ''}`}>
      {isRecommended && (
        <Badge className="absolute top-2 right-2 z-10" variant="default">
          Recommandé
        </Badge>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          {nom_famille}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <MapPin className="w-3 h-3" />
          <span>{distance_km} km de chez vous</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary/70" />
            <span>{jour_reunion}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary/70" />
            <span>{heure_reunion.substring(0, 5)}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-primary/70" />
            <span>Chef: {chef_nom}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-primary/70" />
            <span>{chef_telephone}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          variant={isRecommended ? "default" : "outline"}
          onClick={() => onSelect(id)}
        >
          Rejoindre cette FI
        </Button>
      </CardFooter>
    </Card>
  );
}
