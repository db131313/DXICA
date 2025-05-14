import { useState } from 'react';
import SearchInterface from './components/SearchInterface';
import ResultsPage from './components/ResultsPage';

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

  return (
    <div className="min-h-screen bg-gradient-main">
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">DXICA</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              Sign Up
            </button>
            <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              Log In
            </button>
      </div>
      </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {!searchState.isSearching ? (
          <>
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
          </>
        ) : (
          <ResultsPage
            keywords={searchState.keywords}
            selectedPlatforms={searchState.selectedPlatforms}
          />
        )}
      </main>
    </div>
  );
}

export default App;
