"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/carte", label: "Carte" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-[rgba(10,10,18,0.85)] backdrop-blur-xl border-b border-[var(--glass-border)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-shadow duration-300">
            <span className="text-[#0a0a12] font-bold text-lg">FI</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold gradient-text">
              Familles d&apos;Impact
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300 rounded-lg hover:bg-[rgba(212,168,67,0.08)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="hidden sm:inline-flex btn-primary text-sm !py-2.5 !px-5"
          >
            Se Connecter
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-[rgba(212,168,67,0.1)] transition-colors"
            aria-label="Menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[var(--primary)] transition-all duration-300 ${
                isMobileMenuOpen
                  ? "rotate-45 translate-y-1.5"
                  : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[var(--primary)] mt-1 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[var(--primary)] mt-1 transition-all duration-300 ${
                isMobileMenuOpen
                  ? "-rotate-45 -translate-y-1.5"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[rgba(10,10,18,0.95)] backdrop-blur-xl border-b border-[var(--glass-border)] transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300 rounded-lg hover:bg-[rgba(212,168,67,0.08)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/connexion"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-primary mt-3 text-center"
          >
            Se Connecter
          </Link>
        </nav>
      </div>
    </header>
  );
}
