export default function ConnexionPlaceholder() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--surface-lighter)] border flex items-center justify-center border-[var(--border)] mb-6 shadow-[var(--shadow-glow)]">
        <span className="text-3xl">🔐</span>
      </div>
      <h1 className="text-4xl font-bold mb-4 gradient-text">Connexion</h1>
      <p className="text-xl text-[var(--text-secondary)] max-w-lg mb-8">
        Le système d&apos;authentification et la création de profil seront
        implémentés lors du Sprint 1.
      </p>
      <div className="glass-card p-6 max-w-md w-full text-left border-[var(--primary)]">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Numéro de téléphone
            </label>
            <input
              type="text"
              disabled
              placeholder="+237 ..."
              className="w-full bg-[var(--surface-light)] border border-[var(--border)] rounded-lg px-4 py-3 text-white opacity-50 cursor-not-allowed"
            />
          </div>
          <button
            disabled
            className="w-full btn-primary opacity-50 cursor-not-allowed"
          >
            Recevoir le code OTP (Bientôt)
          </button>
        </form>
      </div>
    </div>
  );
}
