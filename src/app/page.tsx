"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Users, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--foreground)]">
                L&apos;Église se rapproche de vous
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up delay-100">
              Trouvez votre{" "}
              <span className="gradient-text-animated">Famille d&apos;Impact</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl animate-fade-in-up delay-200">
              Rejoignez une cellule de proximité pour grandir dans la foi,
              partager des moments de fraternité et rester connecté à
              l&apos;Église, près de chez vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
              <Link href="/carte" className="btn-primary text-base !py-4 !px-8">
                <MapPin className="w-5 h-5" />
                Localiser ma cellule
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link href="/connexion" className="btn-secondary text-base !py-4 !px-8">
                Espace Membre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[var(--surface)] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi rejoindre une FI ?
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Une Famille d&apos;Impact n&apos;est pas juste une réunion
              hebdomadaire, c&apos;est le cœur battant de notre église.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-7 h-7 text-[#0a0a12]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Proximité Géographique</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Fini les longs trajets. Retrouvez-vous chaque mardi ou jeudi avec
                des frères et sœurs qui vivent dans votre quartier.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Suivi Personnalisé</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Votre chef de famille veille sur vous, vous accompagne
                spirituellement et prie pour vos besoins spécifiques.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Croissance Spirituelle</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Accédez aux documents hebdomadaires, étudiez la Parole ensemble
                et édifiez-vous mutuellement lors des rencontres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-[var(--border-light)] -translate-y-1/2 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-lighter)] border-2 border-[var(--primary)] flex items-center justify-center text-2xl font-bold text-[var(--primary)] mb-6 shadow-[var(--shadow-glow)]">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Créez votre profil</h3>
              <p className="text-[var(--text-muted)]">
                Inscrivez-vous rapidement et renseignez votre adresse ou
                placez-vous sur la carte.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-lighter)] border-2 border-[var(--primary)] flex items-center justify-center text-2xl font-bold text-[var(--primary)] mb-6 shadow-[var(--shadow-glow)]">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Découvrez vos options</h3>
              <p className="text-[var(--text-muted)]">
                L&apos;algorithme vous propose instantanément les 3 cellules les
                plus proches de chez vous.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-lighter)] border-2 border-[var(--primary)] flex items-center justify-center text-2xl font-bold text-[var(--primary)] mb-6 shadow-[var(--shadow-glow)]">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Rejoignez la famille</h3>
              <p className="text-[var(--text-muted)]">
                Validez votre choix, contactez votre chef et commencez à assister
                aux réunions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--surface)] border-y border-[var(--border-light)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-pulse-glow inline-block">50+</div>
              <p className="text-[var(--text-secondary)] font-medium">Familles Actives</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-pulse-glow inline-block">1000+</div>
              <p className="text-[var(--text-secondary)] font-medium">Membres Connectés</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-pulse-glow inline-block">2</div>
              <p className="text-[var(--text-secondary)] font-medium">Jours de Réunion</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-pulse-glow inline-block">1</div>
              <p className="text-[var(--text-secondary)] font-medium">Communauté Unie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Prêt à faire le pas ?
        </h2>
        <p className="text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
          Ne restez plus isolé. Une place vous attend dans une de nos familles.
        </p>
        <Link href="/carte" className="btn-primary text-lg !py-4 !px-10">
          Trouver ma cellule maintenant
        </Link>
      </section>
    </div>
  );
}
