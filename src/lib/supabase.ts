import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type AntSpecies = {
  id: string;
  genus: string;
  species_name: string;
  description: string;
  created_at: string;
};

export type Colony = {
  id: string;
  user_id: string;
  species_id: string | null;
  name: string;
  description: string;
  queen_count: number;
  worker_count: number;
  founding_date: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  species?: AntSpecies;
  profile?: Profile;
};

export type FeedingSchedule = {
  id: string;
  colony_id: string;
  user_id: string;
  food_type: string;
  frequency: string;
  notes: string;
  created_at: string;
};

export type FeedingLog = {
  id: string;
  colony_id: string;
  user_id: string;
  food_type: string;
  amount: string | null;
  notes: string;
  fed_at: string;
};
