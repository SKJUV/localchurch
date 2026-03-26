"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, LogOut, Save } from "lucide-react";
import { LocationPicker } from "@/components/profile/LocationPicker";

export default function ProfilPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    nom_complet: "",
    telephone: "",
    adresse_texte: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/connexion");
        return;
      }

      setUser(authUser);

      // Charger les données du profil s'il existe
      const { data: profile } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        const p = profile as any;
        // Extraction des lat/lng depuis le champ PostGIS POINT(lng lat)
        let lat = null;
        let lng = null;
        if (p.coords_domicile && typeof p.coords_domicile === 'string') {
           // Format attendu: POINT(12.34 56.78)
           const match = p.coords_domicile.match(/POINT\(([-.\d]+)\s([-.\d]+)\)/);
           if (match) {
             lng = parseFloat(match[1]);
             lat = parseFloat(match[2]);
           }
        }

        setFormData({
          nom_complet: p.nom_complet || "",
          telephone: p.telephone || "",
          adresse_texte: p.adresse_texte || "",
          lat,
          lng,
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/connexion");
  };

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat, lng }));
  };

  const handleGeocodeAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adresse_texte) return;
    
    try {
      // Use OpenStreetMap Nominatim for free geocoding
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.adresse_texte)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        toast.success("Adresse trouvée sur la carte");
        setFormData((prev) => ({
          ...prev,
          lat,
          lng,
          adresse_texte: data[0].display_name,
        }));
      } else {
        toast.error("Adresse introuvable. Veuillez placer le repère manuellement sur la carte.");
      }
    } catch (error) {
       toast.error("Erreur de recherche d'adresse");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom_complet) {
      toast.error("Le nom est obligatoire");
      return;
    }

    if (!formData.telephone) {
      toast.error("Le numéro de téléphone est obligatoire");
      return;
    }

    if (!formData.lat || !formData.lng) {
      toast.error("Veuillez définir votre position sur la carte");
      return;
    }

    setSaving(true);
    try {
      // Préparer le point PostGIS
      const coords_domicile = `POINT(${formData.lng} ${formData.lat})`;

      const { error } = await (supabase.from("utilisateurs") as any)
        .upsert({
          id: user.id,
          nom_complet: formData.nom_complet,
          telephone: formData.telephone,
          adresse_texte: formData.adresse_texte,
          coords_domicile,
        });

      if (error) {
        console.error(error);
        toast.error("Erreur lors de la sauvegarde: " + error.message);
      } else {
        toast.success("Modifications enregistrées avec succès !");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Profil</h1>
          <p className="text-muted-foreground mt-1">
            Mise à jour de vos informations personnelles et de votre localisation.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
          <CardDescription>
            {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="profile-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nom_complet">Nom Complet <span className="text-destructive">*</span></Label>
              <Input
                id="nom_complet"
                required
                placeholder="Ex: Jean Dupont"
                value={formData.nom_complet}
                onChange={(e) => setFormData({ ...formData, nom_complet: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone <span className="text-destructive">*</span></Label>
              <Input
                id="telephone"
                type="tel"
                required
                placeholder="+237 600 000 000"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Localisation du Domicile</h3>
              <p className="text-sm text-muted-foreground">
                Cette étape est indispensable pour vous affecter à la Famille d&apos;Impact la plus proche.
              </p>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse complète</Label>
                <div className="flex gap-2">
                  <Input
                    id="adresse"
                    placeholder="Quartier, Rue, Ville..."
                    value={formData.adresse_texte}
                    onChange={(e) => setFormData({ ...formData, adresse_texte: e.target.value })}
                  />
                  <Button type="button" variant="secondary" onClick={handleGeocodeAddress}>
                    Rechercher
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">
                  Ou placez le repère manuellement sur la carte <span className="text-destructive">*</span>
                </Label>
                <LocationPicker
                  latitude={formData.lat}
                  longitude={formData.lng}
                  onChange={handleLocationChange}
                />
                {!formData.lat && (
                   <p className="text-xs text-destructive mt-1 font-medium">Position requise pour sauvegarder</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/20">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Annuler
          </Button>
          <Button type="submit" form="profile-form" disabled={saving || !formData.lat}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Enregistrer les modifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
