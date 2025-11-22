import { antSpecies } from './data/ants.js';
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { ColonyList } from './components/Colonies/ColonyList';
import { PublicColonies } from './components/Colonies/PublicColonies';
import { SpeciesDirectory } from './components/Species/SpeciesDirectory';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('colonies');

  // GEÇİCİ: Her zaman species göstersin
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* <Navigation activeTab={activeTab} onTabChange={setActiveTab} /> */}
      
      <main>
        <SpeciesDirectory />
      </main>
    </div>
  );
}
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        {activeTab === 'colonies' && <ColonyList />}
        {activeTab === 'public' && <PublicColonies />}
        {activeTab === 'species' && <SpeciesDirectory />}
      </main>
    </div>
  );
}

export default App;
