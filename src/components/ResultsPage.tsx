import { useEffect, useState } from 'react';
import type { SearchResult } from '../types';
import { GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } from '../config';
import ControlsModal from './ControlsModal';
import MasonryLayout from './MasonryLayout';
import CoverflowLayout from './CoverflowLayout';
import CardModal from './CardModal';

interface ResultsPageProps {
  keywords: string;
  selectedPlatforms: Array<{ name: string; username?: string }>;
}

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
    };
    border: {
      width: number;
      color: string;
    };
    height: number;
  };
}

export default function ResultsPage({ keywords, selectedPlatforms }: ResultsPageProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<'basic' | 'masonry' | 'coverflow'>('basic');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  
  const [settings, setSettings] = useState<Settings>({
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
      },
      border: {
        width: 1,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      height: 300,
    },
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
          throw new Error('Google API configuration is missing. Please check your environment variables.');
        }

        const query = `${keywords} ${selectedPlatforms
          .map(p => p.username ? `site:${p.name.toLowerCase()}.com ${p.username}` : '')
          .filter(Boolean)
          .join(' OR ')}`;

        // First batch of results
        const response1 = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=10`
        );

        // Second batch (start=11)
        const response2 = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=10&start=11`
        );

        // Third batch (start=21)
        const response3 = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=10&start=21`
        );

        // Fourth batch (start=31) - getting extra to ensure we have enough after filtering
        const response4 = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=10&start=31`
        );

        if (!response1.ok || !response2.ok || !response3.ok || !response4.ok) {
          const errorData = await response1.json();
          throw new Error(errorData.error?.message || 'Failed to fetch search results');
        }

        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();
        const data4 = await response4.json();
        
        // Combine all items
        const allItems = [
          ...(data1.items || []),
          ...(data2.items || []),
          ...(data3.items || []),
          ...(data4.items || [])
        ];

        if (!allItems.length) {
          throw new Error('No results found');
        }

        const formattedResults: SearchResult[] = allItems
          .filter(item => item.link && item.link.match(/\.(jpg|jpeg|png|gif|webp)/i)) // Only keep items with valid image URLs
          .map((item: any) => ({
            title: item.title,
            link: item.link,
            description: item.snippet,
            image: item.link,
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}`,
            source: new URL(item.link).hostname,
            date: item.pagemap?.metatags?.[0]?.['article:published_time'],
          }))
          .slice(0, 30); // Ensure we return exactly 30 results

        setResults(formattedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keywords, selectedPlatforms]);

  const handleCardDelete = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-6 max-w-md w-full text-center border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
          <p className="text-white/70">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="min-h-screen relative"
        style={{
          padding: `${settings.page.containerPadding}px`,
          backgroundImage: settings.page.backgroundImage ? `url(${settings.page.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Controls Button */}
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all border border-white/20"
            >
              <span className="material-icons">tune</span>
            </button>

            {showControls && (
              <div className="absolute top-full right-0 mt-2 w-80">
                <ControlsModal
                  settings={settings}
                  selectedLayout={selectedLayout}
                  onLayoutChange={setSelectedLayout}
                  onSettingsChange={setSettings}
                  onClose={() => setShowControls(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {selectedLayout === 'basic' && (
          <div 
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${settings.layout.columnCount}, minmax(0, 1fr))`,
              gap: `${settings.layout.gridGap}px`,
            }}
          >
            {results.map((result, index) => (
              <div
                key={result.link}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden"
              >
                {/* Background Image */}
                <img
                  src={result.image}
                  alt={result.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col">
                  {/* Favicon and Actions */}
                  <div className="flex items-center justify-between mb-auto">
                    <img
                      src={result.favicon}
                      alt={result.source}
                      className="w-8 h-8"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }}
                    />
                    
                    {/* Card Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedResult(result)}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleCardDelete(index)}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                      <button 
                        className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all cursor-move"
                      >
                        <span className="material-icons text-sm">drag_indicator</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-white line-clamp-1 text-shadow"
                    style={{ 
                      fontSize: `${settings.card.font.size}px`,
                      fontFamily: settings.card.font.family,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {result.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedLayout === 'masonry' && (
          <MasonryLayout
            results={results}
            settings={{
              layout: {
                columnCount: settings.layout.columnCount,
                gridGap: settings.layout.gridGap,
              },
              card: {
                border: settings.card.border,
                borderRadius: 12,
                font: settings.card.font,
              },
            }}
            onCardClick={setSelectedResult}
            onCardDelete={handleCardDelete}
          />
        )}

        {selectedLayout === 'coverflow' && (
          <CoverflowLayout
            results={results}
            onSelect={setSelectedResult}
            settings={{
              cardHeight: settings.card.height,
              fontSize: {
                title: settings.card.font.size + 2,
                description: settings.card.font.size,
              },
            }}
          />
        )}
      </div>

      {selectedResult && (
        <CardModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </>
  );
} 