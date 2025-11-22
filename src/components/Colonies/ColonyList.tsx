import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase, Colony } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ColonyCard } from './ColonyCard';
import { ColonyForm } from './ColonyForm';
import { FeedingManager } from '../Feeding/FeedingManager';

export function ColonyList() {
  const { user } = useAuth();
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingColony, setEditingColony] = useState<Colony | null>(null);
  const [feedingColony, setFeedingColony] = useState<Colony | null>(null);

  useEffect(() => {
    loadColonies();
  }, [user]);

  const loadColonies = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('colonies')
      .select('*, species:ant_species(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setColonies(data as Colony[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu koloniyi silmek istediğinizden emin misiniz?')) return;

    await supabase.from('colonies').delete().eq('id', id);
    loadColonies();
  };

  const handleEdit = (colony: Colony) => {
    setEditingColony(colony);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingColony(null);
  };

  const handleFormSave = () => {
    handleFormClose();
    loadColonies();
  };

  if (feedingColony) {
    return <FeedingManager colony={feedingColony} onClose={() => setFeedingColony(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kolonilerim</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Koloni</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : colonies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Henüz koloni eklemediniz.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            İlk koloninizi ekleyin
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colonies.map((colony) => (
            <ColonyCard
              key={colony.id}
              colony={colony}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewFeeding={setFeedingColony}
              isOwner={true}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ColonyForm
          colony={editingColony}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}
