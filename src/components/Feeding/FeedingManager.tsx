import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';
import { supabase, Colony, FeedingSchedule, FeedingLog } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { FeedingScheduleForm } from './FeedingScheduleForm';
import { FeedingLogForm } from './FeedingLogForm';

interface FeedingManagerProps {
  colony: Colony;
  onClose: () => void;
}

export function FeedingManager({ colony, onClose }: FeedingManagerProps) {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<FeedingSchedule | null>(null);

  useEffect(() => {
    loadSchedules();
    loadLogs();
  }, [colony.id]);

  const loadSchedules = async () => {
    const { data } = await supabase
      .from('feeding_schedules')
      .select('*')
      .eq('colony_id', colony.id)
      .order('created_at', { ascending: false });

    if (data) setSchedules(data);
  };

  const loadLogs = async () => {
    const { data } = await supabase
      .from('feeding_logs')
      .select('*')
      .eq('colony_id', colony.id)
      .order('fed_at', { ascending: false })
      .limit(10);

    if (data) setLogs(data);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Bu beslenme programını silmek istediğinizden emin misiniz?')) return;
    await supabase.from('feeding_schedules').delete().eq('id', id);
    loadSchedules();
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('Bu beslenme kaydını silmek istediğinizden emin misiniz?')) return;
    await supabase.from('feeding_logs').delete().eq('id', id);
    loadLogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onClose}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kolonilere Dön</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{colony.name}</h2>
        {colony.species && (
          <p className="text-gray-600 italic">
            {colony.species.genus} {colony.species.species_name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Beslenme Programı</h3>
            <button
              onClick={() => setShowScheduleForm(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ekle</span>
            </button>
          </div>

          {schedules.length === 0 ? (
            <p className="text-gray-600 text-sm">Henüz beslenme programı eklenmemiş.</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{schedule.food_type}</h4>
                      <p className="text-sm text-gray-600">{schedule.frequency}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                  {schedule.notes && (
                    <p className="text-sm text-gray-700 mt-2">{schedule.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Beslenme Geçmişi</h3>
            <button
              onClick={() => setShowLogForm(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Kayıt Ekle</span>
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="text-gray-600 text-sm">Henüz beslenme kaydı yok.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{log.food_type}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(log.fed_at).toLocaleString('tr-TR')}</span>
                      </div>
                      {log.amount && (
                        <p className="text-sm text-gray-700 mt-1">Miktar: {log.amount}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-700 mt-2 border-t border-gray-100 pt-2">
                      {log.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showScheduleForm && (
        <FeedingScheduleForm
          colony={colony}
          schedule={editingSchedule}
          onClose={() => {
            setShowScheduleForm(false);
            setEditingSchedule(null);
          }}
          onSave={() => {
            setShowScheduleForm(false);
            setEditingSchedule(null);
            loadSchedules();
          }}
        />
      )}

      {showLogForm && (
        <FeedingLogForm
          colony={colony}
          onClose={() => setShowLogForm(false)}
          onSave={() => {
            setShowLogForm(false);
            loadLogs();
          }}
        />
      )}
    </div>
  );
}
