"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const visits = parseInt(localStorage.getItem("fi_pwa_visits") || "0");
      if (visits >= 1) {
        const hasDismissed = sessionStorage.getItem("fi_pwa_dismissed") === "true";
        if (!hasDismissed) {
          setShowPrompt(true);
        }
      } else {
        localStorage.setItem("fi_pwa_visits", (visits + 1).toString());
      }
    });

    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("fi_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-[400px] z-50 animate-in fade-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-lg border-primary/20">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4 pt-2">
          <div className="w-12 h-12 flex-shrink-0 bg-primary rounded-xl flex items-center justify-center">
             <span className="text-primary-foreground font-bold text-xl">FI</span>
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-foreground mb-1">
              Installer l&apos;Application
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez Familles d&apos;Impact sur votre écran d&apos;accueil pour un accès hors ligne et plus rapide.
            </p>
            <Button
              onClick={handleInstallClick}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Installer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
