"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/carte", label: "Carte" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">FI</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Familles d&apos;Impact
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/profil">Mon Profil</Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => supabase.auth.signOut()}
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="ml-4">
              <Link href="/connexion">Se Connecter</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b absolute top-16 left-0 right-0 shadow-lg p-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium p-2 text-foreground hover:bg-muted rounded-md"
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  href="/profil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium p-2 text-primary hover:bg-muted rounded-md"
                >
                  Mon Profil
                </Link>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => {
                    supabase.auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="mt-2 w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/connexion">Se Connecter</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
