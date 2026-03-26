"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Lien d'accès envoyé !");
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-muted/20">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
          <MailCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Vérifiez vos emails</h1>
        <p className="text-lg text-muted-foreground max-w-lg mb-8">
          Nous avons envoyé un lien de connexion sécurisé à <strong>{email}</strong>. Cliquez dessus pour accéder à votre espace.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-muted/20">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
        <span className="text-3xl">🔐</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Connexion</h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-8">
        Saisissez votre adresse email pour recevoir un lien de connexion sécurisé.
      </p>

      <Card className="max-w-md w-full text-left">
        <CardHeader>
          <CardTitle>Accès Membre</CardTitle>
          <CardDescription>
            Rejoignez ou retrouvez votre Famille d&apos;Impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Recevoir le lien d'accès"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
