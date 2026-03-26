-- ============================================
-- FAMILLES D'IMPACT - Schéma de Base de Données
-- Supabase (PostgreSQL + PostGIS)
-- ============================================

-- 1. Activer l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Créer les types ENUM (avec vérification d'existence)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_utilisateur') THEN
        CREATE TYPE role_utilisateur AS ENUM ('admin', 'chef', 'membre');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'jour_reunion') THEN
        CREATE TYPE jour_reunion AS ENUM ('Mardi', 'Jeudi');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statut_affectation') THEN
        CREATE TYPE statut_affectation AS ENUM ('actif', 'transfere', 'inactif');
    END IF;
END $$;

-- 3. Table: utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) UNIQUE NOT NULL,
  role role_utilisateur DEFAULT 'membre',
  adresse_texte TEXT,
  coords_domicile GEOGRAPHY(POINT, 4326),
  cree_le TIMESTAMPTZ DEFAULT NOW()
);

-- Index spatial GIST pour les performances de géolocalisation
CREATE INDEX IF NOT EXISTS idx_utilisateurs_coords ON utilisateurs USING GIST (coords_domicile);

-- 4. Table: familles_impact
CREATE TABLE IF NOT EXISTS familles_impact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_famille VARCHAR(100) UNIQUE NOT NULL,
  chef_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
  adresse_reunion TEXT NOT NULL,
  emplacement_reunion GEOGRAPHY(POINT, 4326) NOT NULL,
  jour_reunion jour_reunion NOT NULL,
  heure_reunion TIME NOT NULL
);

-- Index spatial GIST sur le lieu de réunion
CREATE INDEX IF NOT EXISTS idx_fi_emplacement ON familles_impact USING GIST (emplacement_reunion);

-- 5. Table: affectations
CREATE TABLE IF NOT EXISTS affectations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  famille_id UUID NOT NULL REFERENCES familles_impact(id) ON DELETE CASCADE,
  statut statut_affectation DEFAULT 'actif',
  date_integration TIMESTAMPTZ DEFAULT NOW(),
  -- Un membre ne peut être affecté qu'une fois à une même famille
  UNIQUE(membre_id, famille_id)
);

-- 6. Table: presences_reunions
CREATE TABLE IF NOT EXISTS presences_reunions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  famille_id UUID NOT NULL REFERENCES familles_impact(id) ON DELETE CASCADE,
  membre_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  date_reunion DATE NOT NULL,
  est_present BOOLEAN DEFAULT TRUE,
  -- Un membre ne peut être pointé qu'une fois par réunion
  UNIQUE(famille_id, membre_id, date_reunion)
);

-- 7. Table: documents_hebdo
CREATE TABLE IF NOT EXISTS documents_hebdo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(200) NOT NULL,
  url_fichier TEXT NOT NULL,
  semaine_cible DATE NOT NULL
);

-- ============================================
-- FONCTION RPC: Trouver les FI les plus proches
-- ============================================
DROP FUNCTION IF EXISTS trouver_fi_proches(FLOAT, FLOAT, INT);

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
  chef_telephone VARCHAR(20),
  lat_reunion FLOAT,
  lng_reunion FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fi.id,
    fi.nom_famille,
    fi.adresse_reunion,
    fi.jour_reunion,
    fi.heure_reunion,
    ROUND(
      (ST_Distance(
        fi.emplacement_reunion,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
      ) / 1000.0)::numeric
    , 2) AS distance_km,
    u.nom_complet AS chef_nom,
    u.telephone AS chef_telephone,
    ST_Y(fi.emplacement_reunion::geometry) AS lat_reunion,
    ST_X(fi.emplacement_reunion::geometry) AS lng_reunion
  FROM familles_impact fi
  JOIN utilisateurs u ON fi.chef_id = u.id
  WHERE ST_DWithin(
    fi.emplacement_reunion,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    rayon_km * 1000
  )
  ORDER BY fi.emplacement_reunion <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  LIMIT 3;
END;
$$;

-- ============================================
-- FONCTIONS DE SECURITE (Bypass RLS Recursion)
-- ============================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION est_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM utilisateurs 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Check if current user is the chef of a specific member
CREATE OR REPLACE FUNCTION est_chef_de_membre(membre_id_p UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM affectations a
    JOIN familles_impact fi ON a.famille_id = fi.id
    WHERE fi.chef_id = auth.uid() 
    AND a.membre_id = membre_id_p
  );
END;
$$;

-- Check if current user is the chef of a specific family
CREATE OR REPLACE FUNCTION est_chef_de_famille(famille_id_p UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM familles_impact
    WHERE id = famille_id_p 
    AND chef_id = auth.uid()
  );
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE familles_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE affectations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presences_reunions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_hebdo ENABLE ROW LEVEL SECURITY;

-- 1. utilisateurs
DROP POLICY IF EXISTS "Acces membre" ON utilisateurs;
DROP POLICY IF EXISTS "Acces admin" ON utilisateurs;
DROP POLICY IF EXISTS "Acces chef" ON utilisateurs;
DROP POLICY IF EXISTS "Modif soi-meme" ON utilisateurs;
DROP POLICY IF EXISTS "Insert soi-meme" ON utilisateurs;

CREATE POLICY "Acces membre" ON utilisateurs FOR SELECT USING (id = auth.uid());
CREATE POLICY "Acces admin" ON utilisateurs FOR SELECT USING (est_admin());
CREATE POLICY "Acces chef" ON utilisateurs FOR SELECT USING (est_chef_de_membre(id));
CREATE POLICY "Modif soi-meme" ON utilisateurs FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Insert soi-meme" ON utilisateurs FOR INSERT WITH CHECK (id = auth.uid());

-- 2. familles_impact
DROP POLICY IF EXISTS "Lecture publique" ON familles_impact;
DROP POLICY IF EXISTS "Admin insert" ON familles_impact;
DROP POLICY IF EXISTS "Admin update" ON familles_impact;
DROP POLICY IF EXISTS "Admin delete" ON familles_impact;

CREATE POLICY "Lecture publique" ON familles_impact FOR SELECT USING (true);
CREATE POLICY "Admin insert" ON familles_impact FOR INSERT WITH CHECK (est_admin());
CREATE POLICY "Admin update" ON familles_impact FOR UPDATE USING (est_admin());
CREATE POLICY "Admin delete" ON familles_impact FOR DELETE USING (est_admin());

-- 3. affectations
DROP POLICY IF EXISTS "Voir ses affectations" ON affectations;
DROP POLICY IF EXISTS "Chefs voient leur famille" ON affectations;
DROP POLICY IF EXISTS "Admin gère affectations" ON affectations;
DROP POLICY IF EXISTS "Rejoindre famille" ON affectations;

CREATE POLICY "Voir ses affectations" ON affectations FOR SELECT USING (membre_id = auth.uid());
CREATE POLICY "Chefs voient leur famille" ON affectations FOR SELECT USING (est_chef_de_famille(famille_id));
CREATE POLICY "Admin gère affectations" ON affectations FOR ALL USING (est_admin());
CREATE POLICY "Rejoindre famille" ON affectations FOR INSERT WITH CHECK (membre_id = auth.uid());

-- 4. presences_reunions
DROP POLICY IF EXISTS "Chefs gèrent présences" ON presences_reunions;
DROP POLICY IF EXISTS "Membres voient présences" ON presences_reunions;

CREATE POLICY "Chefs gèrent présences" ON presences_reunions FOR ALL USING (est_chef_de_famille(famille_id));
CREATE POLICY "Membres voient présences" ON presences_reunions FOR SELECT USING (membre_id = auth.uid());

-- 5. documents_hebdo
DROP POLICY IF EXISTS "Lecture publique docs" ON documents_hebdo;
DROP POLICY IF EXISTS "Gestion admin docs" ON documents_hebdo;

CREATE POLICY "Lecture publique docs" ON documents_hebdo FOR SELECT USING (true);
CREATE POLICY "Gestion admin docs" ON documents_hebdo FOR ALL USING (est_admin());
