"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  MessageSquare, 
  BookOpen,
  ArrowRight,
  Home
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [family, setFamily] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/connexion");
        return;
      }

      // 1. Fetch User Profile
      const { data: profileData } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(profileData);

      // 2. Fetch Active Assignment
      const { data: affectation } = await supabase
        .from("affectations")
        .select("famille_id")
        .eq("membre_id", user.id)
        .eq("statut", "actif")
        .maybeSingle();

      if (affectation) {
        // 3. Fetch Family details with Chef info
        const { data: familyData } = await supabase
          .from("familles_impact")
          .select(`
            *,
            chef:utilisateurs!familles_impact_chef_id_fkey (
              nom_complet,
              telephone
            )
          `)
          .eq("id", (affectation as any).famille_id)
          .single();
        
        setFamily(familyData);
      }

      setLoading(false);
    }

    loadDashboardData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header avec bienvenue */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour, {profile?.nom_complet?.split(' ')[0] || "Membre"}</h1>
          <p className="text-muted-foreground">Ravi de vous revoir dans votre espace personnel.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/profil">
              <User className="w-4 h-4 mr-2" />
              Mon Profil
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche: Statut Famille */}
        <div className="lg:col-span-2 space-y-8">
          {family ? (
            <Card className="overflow-hidden border-2 border-primary/10 shadow-md">
              <CardHeader className="bg-primary/5 pb-6">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Home className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider text-primary/80">Ma Famille d&apos;Impact</span>
                </div>
                <CardTitle className="text-3xl">{family.nom_famille}</CardTitle>
                <CardDescription className="text-base flex items-center mt-2">
                  <MapPin className="w-4 h-4 mr-1 text-primary/60" />
                  {family.adresse_reunion}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Prochaine Réunion</h4>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted flex flex-col items-center justify-center min-w-[70px]">
                      <Calendar className="w-5 h-5 mb-1 text-primary" />
                      <span className="text-sm font-bold">{family.jour_reunion}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xl">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {family.heure_reunion.substring(0, 5)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        Votre présence contribue à l&apos;édification de tous.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Votre Responsable</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {family.chef?.nom_complet?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{family.chef?.nom_complet}</div>
                      <div className="flex items-center gap-3 mt-2">
                         <Button asChild size="sm" variant="secondary" className="h-8">
                           <a href={`tel:${family.chef?.telephone}`}>
                             <Phone className="w-3.5 h-3.5 mr-1" />
                             Appeler
                           </a>
                         </Button>
                         <Button asChild size="sm" variant="outline" className="h-8 border-primary/20 hover:bg-primary/5">
                           <a href={`https://wa.me/${family.chef?.telephone?.replace(/\s/g, '')}`} target="_blank">
                             <MessageSquare className="w-3.5 h-3.5 mr-1" />
                             WhatsApp
                           </a>
                         </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-muted/30 border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pas de cellule assignée</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  Vous n&apos;avez pas encore rejoint de Famille d&apos;Impact. 
                  Utilisez la carte pour trouver les groupes les plus proches de chez vous.
                </p>
                <Button asChild size="lg" className="rounded-full px-8 h-12">
                  <Link href="/carte">
                    Trouver ma cellule
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Documents Hebdo (Placeholder semi-réel) */}
          <div className="pt-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Partages de la semaine
            </h3>
            <Card className="hover:border-primary/30 transition-colors group cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold group-hover:text-primary transition-colors">Guide d&apos;Impact - Semaine du 24 Mars</div>
                    <div className="text-sm text-muted-foreground italic">"Grandir dans l&apos;unité fraternelle"</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Colonne Droite: Infos & Église */}
        <div className="space-y-6">
           <Card className="bg-primary text-primary-foreground overflow-hidden">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
             <CardHeader>
               <CardTitle>Notre Vision</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-primary-foreground/90 text-sm leading-relaxed italic">
                 "Une église sans cellules est comme un corps sans poumons." 
                 <br /><br />
                 Les Familles d&apos;Impact sont là pour vous assurer un accompagnement spirituel personnalisé.
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Besoin d&apos;aide ?</CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-muted-foreground space-y-4">
               <p>
                 Si vous avez déménagé ou souhaitez changer de cellule, veuillez contacter l&apos;administration de l&apos;église.
               </p>
               <Button variant="outline" className="w-full justify-start text-foreground" size="sm">
                 <Phone className="w-4 h-4 mr-2" />
                 Secrétariat Église
               </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
