-- ============================================
-- FAMILLES D'IMPACT - Schéma de Base de Données
-- Supabase (PostgreSQL + PostGIS)
-- ============================================

-- 1. Activer l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Créer les types ENUM
CREATE TYPE role_utilisateur AS ENUM ('admin', 'chef', 'membre');
CREATE TYPE jour_reunion AS ENUM ('Mardi', 'Jeudi');
CREATE TYPE statut_affectation AS ENUM ('actif', 'transfere', 'inactif');

-- 3. Table: utilisateurs
CREATE TABLE utilisateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) UNIQUE NOT NULL,
  role role_utilisateur DEFAULT 'membre',
  adresse_texte TEXT,
  coords_domicile GEOGRAPHY(POINT, 4326),
  cree_le TIMESTAMPTZ DEFAULT NOW()
);

-- Index spatial GIST pour les performances de géolocalisation
CREATE INDEX idx_utilisateurs_coords ON utilisateurs USING GIST (coords_domicile);

-- 4. Table: familles_impact
CREATE TABLE familles_impact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_famille VARCHAR(100) UNIQUE NOT NULL,
  chef_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
  adresse_reunion TEXT NOT NULL,
  emplacement_reunion GEOGRAPHY(POINT, 4326) NOT NULL,
  jour_reunion jour_reunion NOT NULL,
  heure_reunion TIME NOT NULL
);

-- Index spatial GIST sur le lieu de réunion
CREATE INDEX idx_fi_emplacement ON familles_impact USING GIST (emplacement_reunion);

-- 5. Table: affectations
CREATE TABLE affectations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  famille_id UUID NOT NULL REFERENCES familles_impact(id) ON DELETE CASCADE,
  statut statut_affectation DEFAULT 'actif',
  date_integration TIMESTAMPTZ DEFAULT NOW(),
  -- Un membre ne peut être affecté qu'une fois à une même famille
  UNIQUE(membre_id, famille_id)
);

-- 6. Table: presences_reunions
CREATE TABLE presences_reunions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  famille_id UUID NOT NULL REFERENCES familles_impact(id) ON DELETE CASCADE,
  membre_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  date_reunion DATE NOT NULL,
  est_present BOOLEAN DEFAULT TRUE,
  -- Un membre ne peut être pointé qu'une fois par réunion
  UNIQUE(famille_id, membre_id, date_reunion)
);

-- 7. Table: documents_hebdo
CREATE TABLE documents_hebdo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(200) NOT NULL,
  url_fichier TEXT NOT NULL,
  semaine_cible DATE NOT NULL
);

-- ============================================
-- FONCTION RPC: Trouver les FI les plus proches
-- ============================================
CREATE OR REPLACE FUNCTION trouver_fi_proches(
  lat FLOAT,
  lng FLOAT,
  rayon_km INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  nom_famille VARCHAR(100),
  adresse_reunion TEXT,
  jour_reunion jour_reunion,
  heure_reunion TIME,
  distance_km FLOAT,
  chef_nom VARCHAR(255),
  chef_telephone VARCHAR(20)
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    fi.id,
    fi.nom_famille,
    fi.adresse_reunion,
    fi.jour_reunion,
    fi.heure_reunion,
    ROUND(
      ST_Distance(
        fi.emplacement_reunion,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
      ) / 1000.0
    , 2) AS distance_km,
    u.nom_complet AS chef_nom,
    u.telephone AS chef_telephone
  FROM familles_impact fi
  JOIN utilisateurs u ON fi.chef_id = u.id
  WHERE ST_DWithin(
    fi.emplacement_reunion,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    rayon_km * 1000
  )
  ORDER BY fi.emplacement_reunion <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  LIMIT 3;
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE familles_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE affectations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presences_reunions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_hebdo ENABLE ROW LEVEL SECURITY;

-- Politiques pour utilisateurs
CREATE POLICY "Les utilisateurs voient leur propre profil"
  ON utilisateurs FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les admins voient tous les utilisateurs"
  ON utilisateurs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les chefs voient les membres de leur famille"
  ON utilisateurs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM familles_impact fi
      JOIN affectations a ON a.famille_id = fi.id
      WHERE fi.chef_id = auth.uid()
      AND a.membre_id = utilisateurs.id
    )
  );

CREATE POLICY "Les utilisateurs peuvent modifier leur profil"
  ON utilisateurs FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Inscription libre"
  ON utilisateurs FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Politiques pour familles_impact
CREATE POLICY "Tout le monde voit les familles"
  ON familles_impact FOR SELECT
  USING (true);

CREATE POLICY "Seuls les admins gèrent les familles"
  ON familles_impact FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour affectations
CREATE POLICY "Les membres voient leur affectation"
  ON affectations FOR SELECT
  USING (membre_id = auth.uid());

CREATE POLICY "Les chefs voient les affectations de leur famille"
  ON affectations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM familles_impact
      WHERE id = affectations.famille_id AND chef_id = auth.uid()
    )
  );

CREATE POLICY "Admins gèrent les affectations"
  ON affectations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les membres peuvent rejoindre une famille"
  ON affectations FOR INSERT
  WITH CHECK (membre_id = auth.uid());

-- Politiques pour presences_reunions
CREATE POLICY "Les chefs gèrent les présences de leur famille"
  ON presences_reunions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM familles_impact
      WHERE id = presences_reunions.famille_id AND chef_id = auth.uid()
    )
  );

CREATE POLICY "Les membres voient leurs présences"
  ON presences_reunions FOR SELECT
  USING (membre_id = auth.uid());

-- Politiques pour documents_hebdo
CREATE POLICY "Tout le monde voit les documents"
  ON documents_hebdo FOR SELECT
  USING (true);

CREATE POLICY "Admins gèrent les documents"
  ON documents_hebdo FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs WHERE id = auth.uid() AND role = 'admin'
    )
  );
