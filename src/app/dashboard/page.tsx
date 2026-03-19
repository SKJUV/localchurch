export default function DashboardPlaceholder() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--surface-lighter)] border flex items-center justify-center border-[var(--border)] mb-6 shadow-[var(--shadow-glow)]">
        <span className="text-3xl">📊</span>
      </div>
      <h1 className="text-4xl font-bold mb-4 gradient-text">Tableau de Bord</h1>
      <p className="text-xl text-[var(--text-secondary)] max-w-lg mb-8">
        Les outils de gestion pour les Chefs de FI et l&apos;Administration seront
        ajoutés lors du Sprint 3.
      </p>
      <div className="glass-card p-6 max-w-md w-full text-left">
        <h3 className="font-bold mb-2">Au programme :</h3>
        <ul className="list-disc list-inside text-[var(--text-muted)] space-y-2">
          <li>Trombinoscope des membres</li>
          <li>Bouton d&apos;appel rapide WhatsApp</li>
          <li>Suivi des présences</li>
          <li>Statistiques mensuelles</li>
        </ul>
      </div>
    </div>
  );
}
