"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 flex items-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Trouvez votre{" "}
              <span className="text-primary">Famille d&apos;Impact</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
              Rejoignez une cellule de proximité pour grandir dans la foi,
              partager des moments de fraternité et rester connecté à
              l&apos;Église.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 px-8 text-base rounded-full">
                <Link href="/carte">
                  <MapPin className="w-5 h-5 mr-2" />
                  Localiser ma cellule
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full">
                <Link href="/connexion">
                  Espace Membre
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi nous rejoindre ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Une Famille d&apos;Impact est le cœur battant de notre communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proximité</h3>
              <p className="text-muted-foreground leading-relaxed">
                Retrouvez-vous chaque mardi ou jeudi avec des frères et sœurs qui vivent dans votre quartier. Fini les longs trajets.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Communauté</h3>
              <p className="text-muted-foreground leading-relaxed">
                Votre chef de cellule veille sur vous, vous accompagne et prie pour vos besoins spécifiques tout au long de la semaine.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Croissance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Accédez aux partages de la semaine, étudiez la Parole ensemble et édifiez-vous mutuellement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Inscription</h3>
              <p className="text-muted-foreground">
                Créez votre compte en quelques instants et renseignez votre localisation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Localisation</h3>
              <p className="text-muted-foreground">
                L&apos;application identifie automatiquement les cellules les plus proches de votre domicile.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Intégration</h3>
              <p className="text-muted-foreground">
                Confirmez votre choix et entrez en contact avec votre responsable de cellule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Une place vous attend dans notre communauté. Faites le premier pas aujourd&apos;hui.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-base rounded-full">
            <Link href="/carte">
              Trouver ma cellule maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
