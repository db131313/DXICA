import { useState } from 'react';
import SearchInterface from './components/SearchInterface';
import ResultsPage from './components/ResultsPage';
import ControlsModal from './components/ControlsModal';

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

function App() {
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
    <div className="min-h-screen bg-gradient-main">
      <nav className="fixed top-0 left-0 right-0 bg-white/5 backdrop-blur-sm z-50 w-screen">
        <div className="w-full px-6 py-4 flex items-center">
          <button 
            onClick={handleReset}
            className="text-2xl font-bold text-white hover:text-white/80 transition-colors"
          >
            DXICA
          </button>
          <div className="ml-auto flex items-center gap-4">
            {searchState.isSearching && (
              <button
                onClick={() => setShowControls(!showControls)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all border border-white/20"
              >
                <span className="material-icons">settings</span>
              </button>
            )}
            <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              Sign Up
            </button>
            <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              Log In
            </button>
          </div>
        </div>
      </nav>

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
    </div>
  );
}

export default App;
