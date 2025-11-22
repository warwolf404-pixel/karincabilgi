import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Colony, AntSpecies, supabase } from '../../lib/supabase';

interface ColonyFormProps {
  colony?: Colony | null;
  onClose: () => void;
  onSave: () => void;
}

export function ColonyForm({ colony, onClose, onSave }: ColonyFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [speciesId, setSpeciesId] = useState('');
  const [queenCount, setQueenCount] = useState(1);
  const [workerCount, setWorkerCount] = useState(0);
  const [foundingDate, setFoundingDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [species, setSpecies] = useState<AntSpecies[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSpecies();
    if (colony) {
      setName(colony.name);
      setDescription(colony.description);
      setSpeciesId(colony.species_id || '');
      setQueenCount(colony.queen_count);
      setWorkerCount(colony.worker_count);
      setFoundingDate(colony.founding_date || '');
      setIsPublic(colony.is_public);
    }
  }, [colony]);

  const loadSpecies = async () => {
    const { data } = await supabase
      .from('ant_species')
      .select('*')
      .order('genus', { ascending: true })
      .order('species_name', { ascending: true });
    if (data) setSpecies(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const colonyData = {
        name,
        description,
        species_id: speciesId || null,
        queen_count: queenCount,
        worker_count: workerCount,
        founding_date: foundingDate || null,
        is_public: isPublic,
      };

      if (colony) {
        const { error } = await supabase
          .from('colonies')
          .update(colonyData)
          .eq('id', colony.id);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

        const { error } = await supabase
          .from('colonies')
          .insert({ ...colonyData, user_id: user.id });
        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {colony ? 'Koloniyi Düzenle' : 'Yeni Koloni Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Koloni Adı *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tür
            </label>
            <select
              value={speciesId}
              onChange={(e) => setSpeciesId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz...</option>
              {species.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.genus} {s.species_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kraliçe Sayısı *
              </label>
              <input
                type="number"
                value={queenCount}
                onChange={(e) => setQueenCount(parseInt(e.target.value) || 0)}
                min={0}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İşçi Sayısı *
              </label>
              <input
                type="number"
                value={workerCount}
                onChange={(e) => setWorkerCount(parseInt(e.target.value) || 0)}
                min={0}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kuruluş Tarihi
            </label>
            <input
              type="date"
              value={foundingDate}
              onChange={(e) => setFoundingDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Bu koloniyi herkese açık yap
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
