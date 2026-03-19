// Types TypeScript correspondant au schéma Supabase
// Ces types seront mis à jour automatiquement avec: npx supabase gen types typescript

export type RoleUtilisateur = "admin" | "chef" | "membre";
export type JourReunion = "Mardi" | "Jeudi";
export type StatutAffectation = "actif" | "transfere" | "inactif";

export interface Utilisateur {
  id: string;
  nom_complet: string;
  telephone: string;
  role: RoleUtilisateur;
  adresse_texte: string | null;
  coords_domicile: { lat: number; lng: number } | null;
  cree_le: string;
}

export interface FamilleImpact {
  id: string;
  nom_famille: string;
  chef_id: string;
  adresse_reunion: string;
  emplacement_reunion: { lat: number; lng: number };
  jour_reunion: JourReunion;
  heure_reunion: string;
  chef?: Utilisateur;
}

export interface Affectation {
  id: string;
  membre_id: string;
  famille_id: string;
  statut: StatutAffectation;
  date_integration: string;
  membre?: Utilisateur;
  famille?: FamilleImpact;
}

export interface PresenceReunion {
  id: string;
  famille_id: string;
  membre_id: string;
  date_reunion: string;
  est_present: boolean;
  membre?: Utilisateur;
}

export interface DocumentHebdo {
  id: string;
  titre: string;
  url_fichier: string;
  semaine_cible: string;
}

// Résultat de la fonction RPC trouver_fi_proches
export interface FIProche {
  id: string;
  nom_famille: string;
  adresse_reunion: string;
  jour_reunion: JourReunion;
  heure_reunion: string;
  distance_km: number;
  chef_nom: string;
  chef_telephone: string;
}

// Type de base Supabase Database (simplifié - sera généré par CLI)
export interface Database {
  public: {
    Tables: {
      utilisateurs: {
        Row: Utilisateur;
        Insert: Omit<Utilisateur, "id" | "cree_le"> & {
          id?: string;
          cree_le?: string;
        };
        Update: Partial<Omit<Utilisateur, "id">>;
      };
      familles_impact: {
        Row: FamilleImpact;
        Insert: Omit<FamilleImpact, "id" | "chef"> & { id?: string };
        Update: Partial<Omit<FamilleImpact, "id" | "chef">>;
      };
      affectations: {
        Row: Affectation;
        Insert: Omit<Affectation, "id" | "date_integration" | "membre" | "famille"> & {
          id?: string;
          date_integration?: string;
        };
        Update: Partial<Omit<Affectation, "id" | "membre" | "famille">>;
      };
      presences_reunions: {
        Row: PresenceReunion;
        Insert: Omit<PresenceReunion, "id" | "membre"> & { id?: string };
        Update: Partial<Omit<PresenceReunion, "id" | "membre">>;
      };
      documents_hebdo: {
        Row: DocumentHebdo;
        Insert: Omit<DocumentHebdo, "id"> & { id?: string };
        Update: Partial<Omit<DocumentHebdo, "id">>;
      };
    };
    Functions: {
      trouver_fi_proches: {
        Args: { lat: number; lng: number; rayon_km?: number };
        Returns: FIProche[];
      };
    };
  };
}
