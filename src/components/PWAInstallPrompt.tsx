"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Écouter l'événement d'installation PWA
    window.addEventListener("beforeinstallprompt", (e) => {
      // Empêcher l'affichage natif du navigateur
      e.preventDefault();
      // Sauvegarder l'événement pour plus tard
      setDeferredPrompt(e);

      // Logique pour afficher le prompt (ex: vérifier le nombre de visites)
      const visits = parseInt(localStorage.getItem("fi_pwa_visits") || "0");
      if (visits >= 1) { // Afficher après la 1ère visite (donc à la 2ème)
        const hasDismissed = sessionStorage.getItem("fi_pwa_dismissed") === "true";
        if (!hasDismissed) {
          setShowPrompt(true);
        }
      } else {
        localStorage.setItem("fi_pwa_visits", (visits + 1).toString());
      }
    });

    window.addEventListener("appinstalled", () => {
      // L'app a été installée
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log("PWA installée avec succès");
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Afficher le prompt d'installation
    deferredPrompt.prompt();
    
    // Attendre que l'utilisateur réponde
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`L'utilisateur a ${outcome} l'installation`);
    
    // Réinitialiser
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("fi_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-96 z-[100] animate-fade-in-up">
      <div className="glass-card p-5 border border-[var(--primary)] shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-10 blur-3xl rounded-full"></div>
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-white transition-colors p-1"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-2xl flex items-center justify-center p-2 mt-1">
             <span className="text-[#0a0a12] font-bold text-xl">FI</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">Installer l&apos;Application</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed tracking-wide">
              Installez Familles d&apos;Impact sur votre écran d&apos;accueil pour un accès hors ligne, des rappels de réunion et une expérience plus rapide.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleInstallClick}
                className="btn-primary !py-2 !px-4 text-sm flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Installer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
