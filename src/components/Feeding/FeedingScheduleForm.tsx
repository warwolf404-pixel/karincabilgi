import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Colony, FeedingSchedule, supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FeedingScheduleFormProps {
  colony: Colony;
  schedule?: FeedingSchedule | null;
  onClose: () => void;
  onSave: () => void;
}

export function FeedingScheduleForm({ colony, schedule, onClose, onSave }: FeedingScheduleFormProps) {
  const { user } = useAuth();
  const [foodType, setFoodType] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (schedule) {
      setFoodType(schedule.food_type);
      setFrequency(schedule.frequency);
      setNotes(schedule.notes);
    }
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const scheduleData = {
        colony_id: colony.id,
        user_id: user?.id,
        food_type: foodType,
        frequency,
        notes,
      };

      if (schedule) {
        const { error } = await supabase
          .from('feeding_schedules')
          .update(scheduleData)
          .eq('id', schedule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('feeding_schedules')
          .insert(scheduleData);
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Beslenme Programı Ekle</h2>
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
              Yiyecek Türü *
            </label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz...</option>
              <option value="Protein (Böcek)">Protein (Böcek)</option>
              <option value="Karbonhidrat (Bal/Şeker)">Karbonhidrat (Bal/Şeker)</option>
              <option value="Su">Su</option>
              <option value="Meyve">Meyve</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sıklık *
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz...</option>
              <option value="Günlük">Günlük</option>
              <option value="2 Günde Bir">2 Günde Bir</option>
              <option value="Haftalık">Haftalık</option>
              <option value="2 Haftada Bir">2 Haftada Bir</option>
              <option value="Aylık">Aylık</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
