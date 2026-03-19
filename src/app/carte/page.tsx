export default function CartePlaceholder() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--surface-lighter)] border flex items-center justify-center border-[var(--border)] mb-6 shadow-[var(--shadow-glow)]">
        <span className="text-3xl">🗺️</span>
      </div>
      <h1 className="text-4xl font-bold mb-4 gradient-text">Carte Interactive</h1>
      <p className="text-xl text-[var(--text-secondary)] max-w-lg mb-8">
        La fonctionnalité de localisation et d&apos;algorithme de proximité sera
        implémentée lors du Sprint 2.
      </p>
      <div className="glass-card p-6 max-w-md w-full text-left">
        <h3 className="font-bold mb-2">Au programme :</h3>
        <ul className="list-disc list-inside text-[var(--text-muted)] space-y-2">
          <li>Intégration Mapbox</li>
          <li>Algorithme de proximité PostGIS</li>
          <li>Recommandation du Top 3 des FI</li>
          <li>Calcul d&apos;itinéraire et temps de trajet</li>
        </ul>
      </div>
    </div>
  );
}
