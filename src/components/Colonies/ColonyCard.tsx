import { Edit2, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { Colony } from '../../lib/supabase';

interface ColonyCardProps {
  colony: Colony;
  onEdit: (colony: Colony) => void;
  onDelete: (id: string) => void;
  onViewFeeding?: (colony: Colony) => void;
  isOwner: boolean;
}

export function ColonyCard({ colony, onEdit, onDelete, onViewFeeding, isOwner }: ColonyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{colony.name}</h3>
          {colony.species && (
            <p className="text-sm text-gray-600 italic">
              {colony.species.genus} {colony.species.species_name}
            </p>
          )}
          {colony.profile && !isOwner && (
            <p className="text-xs text-gray-500 mt-1">Sahip: {colony.profile.full_name || colony.profile.email}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isOwner && (
            <>
              {colony.is_public ? (
                <Eye className="w-5 h-5 text-green-600" title="Herkese açık" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" title="Özel" />
              )}
            </>
          )}
        </div>
      </div>

      {colony.description && (
        <p className="text-gray-700 text-sm mb-4">{colony.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-gray-50 rounded p-3">
          <span className="text-gray-600">Kraliçe Sayısı:</span>
          <p className="font-semibold text-gray-900">{colony.queen_count}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <span className="text-gray-600">İşçi Sayısı:</span>
          <p className="font-semibold text-gray-900">{colony.worker_count}</p>
        </div>
      </div>

      {colony.founding_date && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Kuruluş: {new Date(colony.founding_date).toLocaleDateString('tr-TR')}</span>
        </div>
      )}

      {isOwner && (
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          {onViewFeeding && (
            <button
              onClick={() => onViewFeeding(colony)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Beslenme Programı
            </button>
          )}
          <button
            onClick={() => onEdit(colony)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Düzenle"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(colony.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Sil"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
