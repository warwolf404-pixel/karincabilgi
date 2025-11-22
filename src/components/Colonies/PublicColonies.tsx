import { useState, useEffect } from 'react';
import { supabase, Colony } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ColonyCard } from './ColonyCard';

export function PublicColonies() {
  const { user } = useAuth();
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicColonies();
  }, []);

  const loadPublicColonies = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('colonies')
      .select('*, species:ant_species(*), profile:profiles(*)')
      .eq('is_public', true)
      .neq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setColonies(data as Colony[]);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Herkese Açık Koloniler</h2>
        <p className="text-gray-600 mt-1">Diğer kullanıcıların paylaştığı kolonileri keşfedin</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : colonies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Henüz herkese açık koloni bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colonies.map((colony) => (
            <ColonyCard
              key={colony.id}
              colony={colony}
              onEdit={() => {}}
              onDelete={() => {}}
              isOwner={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
