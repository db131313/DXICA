import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SearchInterface from './components/SearchInterface';
import ResultsPage from './components/ResultsPage';
import ControlsModal from './components/ControlsModal';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import { NavBar } from './components/NavBar';

interface Settings {
  layout: {
    columnCount: number;
    gridGap: number;
  };
  page: {
    containerPadding: number;
    backgroundImage?: string;
  };
  card: {
    font: {
      family: string;
      size: number;
      color: string;
    };
    border: {
      width: number;
      color: string;
      radius: number;
    };
    height: number;
  };
}

const defaultSettings: Settings = {
  layout: {
    columnCount: 3,
    gridGap: 16,
  },
  page: {
    containerPadding: 24,
    backgroundImage: undefined,
  },
  card: {
    font: {
      family: 'Inter',
      size: 14,
      color: '#ffffff',
    },
    border: {
      width: 1,
      color: 'rgba(255, 255, 255, 0.1)',
      radius: 12,
    },
    height: 300,
  },
};

function MainContent() {
  const [searchState, setSearchState] = useState<{
    isSearching: boolean;
    keywords: string;
    selectedPlatforms: Array<{ name: string; username?: string }>;
  }>({
    isSearching: false,
    keywords: '',
    selectedPlatforms: [],
  });

  const [showControls, setShowControls] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<'basic' | 'masonry' | 'coverflow'>(() => {
    const saved = localStorage.getItem('dxica_layout');
    return (saved as 'basic' | 'masonry' | 'coverflow') || 'basic';
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('dxica_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const handleReset = () => {
    setSearchState({
      isSearching: false,
      keywords: '',
      selectedPlatforms: [],
    });
  };

  return (
    <>
      <NavBar 
        onReset={handleReset}
        showControls={showControls}
        setShowControls={setShowControls}
        isSearching={searchState.isSearching}
      />

      <main className="pt-20">
        {!searchState.isSearching ? (
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold text-center text-white mb-8">
              Search Your Digital Footprint
            </h2>
            <SearchInterface
              onSearch={(keywords, platforms) =>
                setSearchState({
                  isSearching: true,
                  keywords,
                  selectedPlatforms: platforms,
                })
              }
            />
          </div>
        ) : (
          <>
            {showControls && (
              <div className="fixed top-20 right-4 z-50 w-80">
                <ControlsModal
                  settings={settings}
                  selectedLayout={selectedLayout}
                  onLayoutChange={setSelectedLayout}
                  onSettingsChange={setSettings}
                  onClose={() => setShowControls(false)}
                />
              </div>
            )}
            <ResultsPage
              keywords={searchState.keywords}
              selectedPlatforms={searchState.selectedPlatforms}
              settings={settings}
              selectedLayout={selectedLayout}
            />
          </>
        )}
      </main>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-main">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<MainContent />} />
      </Routes>
    </div>
  );
}

export default App;
