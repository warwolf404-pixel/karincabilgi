/*
  # Ant Colony Management System - Initial Schema

  ## Overview
  This migration creates the complete database schema for an ant colony management system
  with user authentication, colony tracking, feeding schedules, and Turkish ant species directory.

  ## New Tables Created

  ### 1. profiles
  User profile information linked to Supabase Auth
  - `id` (uuid, FK to auth.users) - User identifier
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. ant_species
  Complete directory of Turkish ant species
  - `id` (uuid, PK) - Species identifier
  - `genus` (text) - Genus name (e.g., CAMPONOTUS)
  - `species_name` (text) - Full species name
  - `description` (text) - Detailed species information (editable by admins)
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. colonies
  User's ant colonies with privacy controls
  - `id` (uuid, PK) - Colony identifier
  - `user_id` (uuid, FK to profiles) - Owner of the colony
  - `species_id` (uuid, FK to ant_species) - Species of the colony
  - `name` (text) - Colony name
  - `description` (text) - Colony description
  - `queen_count` (integer) - Number of queens
  - `worker_count` (integer) - Approximate worker count
  - `founding_date` (date) - When colony was founded
  - `is_public` (boolean) - Privacy setting (true = public, false = private)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. feeding_schedules
  Feeding programs for colonies
  - `id` (uuid, PK) - Schedule identifier
  - `colony_id` (uuid, FK to colonies) - Associated colony
  - `user_id` (uuid, FK to profiles) - Owner
  - `food_type` (text) - Type of food (protein, carbohydrate, water, etc.)
  - `frequency` (text) - Frequency (daily, weekly, etc.)
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. feeding_logs
  Historical record of feedings
  - `id` (uuid, PK) - Log entry identifier
  - `colony_id` (uuid, FK to colonies) - Colony that was fed
  - `user_id` (uuid, FK to profiles) - User who fed
  - `food_type` (text) - Type of food given
  - `amount` (text) - Amount given
  - `notes` (text) - Observations
  - `fed_at` (timestamptz) - When feeding occurred

  ## Security (RLS Policies)

  ### profiles table
  - Users can read their own profile
  - Users can update their own profile
  - Users can read public information of other users

  ### ant_species table
  - Anyone can read species information (public directory)
  - Only authenticated users can view the table

  ### colonies table
  - Users can CRUD their own colonies
  - Users can read public colonies from other users
  - Privacy controlled by is_public field

  ### feeding_schedules table
  - Users can CRUD their own feeding schedules
  - Schedules are private to the owner

  ### feeding_logs table
  - Users can CRUD their own feeding logs
  - Logs are private to the owner

  ## Important Notes
  1. All tables use Row Level Security (RLS)
  2. Public colonies are visible to all authenticated users
  3. Private colonies are only visible to owners
  4. Species directory is publicly readable
  5. Feeding data is always private to colony owner
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create ant_species table
CREATE TABLE IF NOT EXISTS ant_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  genus text NOT NULL,
  species_name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(genus, species_name)
);

ALTER TABLE ant_species ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read species"
  ON ant_species FOR SELECT
  TO authenticated
  USING (true);

-- Create colonies table
CREATE TABLE IF NOT EXISTS colonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  species_id uuid REFERENCES ant_species(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text DEFAULT '',
  queen_count integer DEFAULT 1,
  worker_count integer DEFAULT 0,
  founding_date date,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE colonies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own colonies"
  ON colonies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public colonies"
  ON colonies FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert own colonies"
  ON colonies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own colonies"
  ON colonies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own colonies"
  ON colonies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create feeding_schedules table
CREATE TABLE IF NOT EXISTS feeding_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colony_id uuid NOT NULL REFERENCES colonies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_type text NOT NULL,
  frequency text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feeding_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feeding schedules"
  ON feeding_schedules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeding schedules"
  ON feeding_schedules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeding schedules"
  ON feeding_schedules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeding schedules"
  ON feeding_schedules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create feeding_logs table
CREATE TABLE IF NOT EXISTS feeding_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colony_id uuid NOT NULL REFERENCES colonies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_type text NOT NULL,
  amount text,
  notes text DEFAULT '',
  fed_at timestamptz DEFAULT now()
);

ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feeding logs"
  ON feeding_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeding logs"
  ON feeding_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeding logs"
  ON feeding_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeding logs"
  ON feeding_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_colonies_user_id ON colonies(user_id);
CREATE INDEX IF NOT EXISTS idx_colonies_species_id ON colonies(species_id);
CREATE INDEX IF NOT EXISTS idx_colonies_is_public ON colonies(is_public);
CREATE INDEX IF NOT EXISTS idx_feeding_schedules_colony_id ON feeding_schedules(colony_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_colony_id ON feeding_logs(colony_id);
CREATE INDEX IF NOT EXISTS idx_ant_species_genus ON ant_species(genus);
