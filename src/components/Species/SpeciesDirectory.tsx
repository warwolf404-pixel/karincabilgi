import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase, AntSpecies } from '../../lib/supabase';

export function SpeciesDirectory() {
  const [species, setSpecies] = useState<AntSpecies[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<AntSpecies[]>([]);
  const [search, setSearch] = useState('');
  const [expandedGenus, setExpandedGenus] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<AntSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecies();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const filtered = species.filter(
        (s) =>
          s.genus.toLowerCase().includes(search.toLowerCase()) ||
          s.species_name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSpecies(filtered);
    } else {
      setFilteredSpecies(species);
    }
  }, [search, species]);

 const loadSpecies = async () => {
  console.log('🚨 VERİTABANINDAN YENİ VERİ ÇEKİLİYOR!');
  setLoading(true);
  
  const { data, error } = await supabase
    .from('ant_species')
    .select('*')
    .order('genus', { ascending: true })
    .order('species_name', { ascending: true });

  console.log('📊 ALINAN VERİ:', data);
  console.log('🔎 İLK KAYIT AÇIKLAMASI:', data?.[0]?.description);
  
  if (data) {
    setSpecies(data);
    setFilteredSpecies(data);
  }
  setLoading(false);
};

  const genusList = Array.from(new Set(filteredSpecies.map((s) => s.genus))).sort();

  const getSpeciesByGenus = (genus: string) => {
    return filteredSpecies.filter((s) => s.genus === genus);
  };

  const toggleGenus = (genus: string) => {
    setExpandedGenus(expandedGenus === genus ? null : genus);
    setSelectedSpecies(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Türkiye'deki Karınca Türleri</h2>
        <p className="text-gray-600">
          Türkiye'de bulunan karınca türlerini keşfedin ve bilgi edinin
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tür veya cins adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Cinsler ({genusList.length})
            </h3>
            <div className="space-y-1">
              {genusList.map((genus) => {
                const speciesCount = getSpeciesByGenus(genus).length;
                const isExpanded = expandedGenus === genus;
                return (
                  <div key={genus}>
                    <button
                      onClick={() => toggleGenus(genus)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                        isExpanded
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{genus}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {speciesCount}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {getSpeciesByGenus(genus).map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSpecies(s)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedSpecies?.id === s.id
                                ? 'bg-green-50 text-green-700'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            {s.species_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {selectedSpecies ? (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedSpecies.species_name}
                </h3>
                <p className="text-lg text-gray-600 mb-6 italic">
                  Cins: {selectedSpecies.genus}
                </p>

                <div className="prose max-w-none">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Tür Hakkında Bilgiler
                  </h4>
                  {selectedSpecies.description ? (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {selectedSpecies.description}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <p className="text-gray-600">
                        Bu tür için henüz bilgi eklenmemiş.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Türler hakkında bilgi eklemek için yönetici ile iletişime geçin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Bir tür seçin veya aramak için yukarıdaki arama kutusunu kullanın</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
