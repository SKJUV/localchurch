import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                <span className="text-[#0a0a12] font-bold text-lg">FI</span>
              </div>
              <span className="text-lg font-bold gradient-text">
                Familles d&apos;Impact
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
              Connecter chaque membre à une communauté de proximité pour grandir
              ensemble dans la foi et la fraternité.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Accueil" },
                { href: "/carte", label: "Carte Interactive" },
                { href: "/dashboard", label: "Tableau de Bord" },
                { href: "/connexion", label: "Connexion" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>📍 Douala, Cameroun</p>
              <p>📞 +237 6XX XXX XXX</p>
              <p>✉️ contact@famillesdimpact.org</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Familles d&apos;Impact. Tous droits
            réservés.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Conçu avec ❤️ pour l&apos;Église
          </p>
        </div>
      </div>
    </footer>
  );
}
