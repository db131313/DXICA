import { useEffect, useState } from 'react';
import type { SearchResult, Settings } from '../types';
import { GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } from '../config';
import ControlsModal from './ControlsModal';
import MasonryLayout from './MasonryLayout';
import CoverflowLayout from './CoverflowLayout';
import CardModal from './CardModal';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import DragOverlay from './DragOverlay';
import SortableItem from './SortableItem';

interface ResultsPageProps {
  keywords: string;
  selectedPlatforms: Array<{ name: string; username?: string }>;
  settings: Settings;
  selectedLayout: 'basic' | 'masonry' | 'coverflow';
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

export default function ResultsPage({ keywords, selectedPlatforms, settings, selectedLayout }: ResultsPageProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setResults((items) => {
        const oldIndex = items.findIndex((item) => item.link === active.id);
        const newIndex = items.findIndex((item) => item.link === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Persist settings and layout changes
  useEffect(() => {
    localStorage.setItem('dxica_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dxica_layout', selectedLayout);
  }, [selectedLayout]);

  // Calculate container offset
  useEffect(() => {
    const calculateOffset = () => {
      const container = document.querySelector('.min-h-screen');
      if (container) {
        const rect = container.getBoundingClientRect();
        document.documentElement.style.setProperty('--container-offset', `${rect.left}px`);
      }
    };

    calculateOffset();
    window.addEventListener('resize', calculateOffset);
    return () => window.removeEventListener('resize', calculateOffset);
  }, []);

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
            link: item.image?.contextLink || item.displayLink || item.link,
            description: item.snippet,
            image: item.link,
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(item.image?.contextLink || item.displayLink || item.link).hostname}&sz=128`,
            source: new URL(item.image?.contextLink || item.displayLink || item.link).hostname,
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
    <div 
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: settings.page.backgroundImage ? `url(${settings.page.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Results Grid */}
      <div 
        style={{
          padding: `${settings.page.containerPadding}px`,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext items={results.map(r => r.link)} strategy={rectSortingStrategy}>
            {selectedLayout === 'basic' && (
              <div 
                className="w-full"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${settings.layout.columnCount}, 1fr)`,
                  gap: `${settings.layout.gridGap}px`,
                  width: '100%',
                  maxWidth: '100%'
                }}
              >
                {results.map((result, index) => (
                  <SortableItem 
                    key={result.link} 
                    id={result.link}
                    result={result}
                    index={index}
                    settings={settings}
                    onEdit={() => setSelectedResult(result)}
                    onDelete={handleCardDelete}
                  />
                ))}
              </div>
            )}

            {selectedLayout === 'masonry' && (
              <MasonryLayout
                results={results}
                settings={settings}
                onCardClick={setSelectedResult}
                onCardDelete={handleCardDelete}
              />
            )}

            {selectedLayout === 'coverflow' && (
              <CoverflowLayout
                results={results}
                onSelect={setSelectedResult}
                onDelete={handleCardDelete}
                settings={settings}
              />
            )}
          </SortableContext>

          {activeId ? (
            <DragOverlay
              result={results.find(r => r.link === activeId)!}
              aspectRatio={selectedLayout === 'basic' ? 'aspect-[4/3]' : 'aspect-[3/4]'}
            />
          ) : null}
        </DndContext>
      </div>

      {selectedResult && (
        <CardModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
          settings={settings}
        />
      )}
    </div>
  );
} 