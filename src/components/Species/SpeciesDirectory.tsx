import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase, AntSpecies } from '../../lib/supabase';

export function SpeciesDirectory() {
  const [species, setSpecies] = useState<AntSpecies[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecies();
  }, []);

  const loadSpecies = async () => {
    console.log('🚨 DEBUG: loadSpecies ÇAĞRILDI!');
    setLoading(true);
    
    try {
      console.log('🔗 Supabase bağlantısı deneniyor...');
      const { data, error } = await supabase
        .from('ant_species')
        .select('*')
        .limit(5);

      console.log('📊 VERİLER:', data);
      console.log('❌ HATA:', error);
      
      if (error) {
        console.error('SUPABASE HATASI:', error);
      }

      if (data) {
        console.log(`✅ ${data.length} kayıt alındı`);
        setSpecies(data);
      } else {
        console.log('⚠️ Hiç veri gelmedi!');
      }
    } catch (err) {
      console.error('⛔ BEKLEMEYEN HATA:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Türkiye'deki Karınca Türleri</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">DEBUG MODU</h3>
        <p>Toplam {species.length} karınca türü yüklendi</p>
        
        {species.length > 0 ? (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">İlk 5 kayıt:</h4>
            {species.slice(0, 5).map((s) => (
              <div key={s.id} className="border-b py-2">
                <strong>{s.genus} {s.species_name}</strong>
                <p className="text-sm text-gray-600">{s.description || 'Açıklama yok'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">⛔ HİÇ VERİ YOK! Supabase bağlantı sorunu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
