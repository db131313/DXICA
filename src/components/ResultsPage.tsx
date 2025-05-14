import { useEffect, useState } from 'react';
import type { SearchResult } from '../types';
import { GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } from '../config';

interface ResultsPageProps {
  keywords: string;
  selectedPlatforms: Array<{ name: string; username?: string }>;
}

export default function ResultsPage({ keywords, selectedPlatforms }: ResultsPageProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch search results');
        }

        const data = await response.json();
        
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('No results found');
        }

        const formattedResults: SearchResult[] = data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          description: item.snippet,
          image: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.imageobject?.[0]?.url,
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}`,
          source: new URL(item.link).hostname,
          date: item.pagemap?.metatags?.[0]?.['article:published_time'],
        }));

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
    <div className="container mx-auto px-4 py-8">
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
        {results.map((result, index) => (
          <a
            key={index}
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-6 break-inside-avoid group"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20">
              {result.image && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={result.favicon}
                      alt={result.source}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-white/80">{result.source}</span>
                  </div>
                  <button className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-full hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-white/90">{result.title}</h3>
                <p className="text-white/70 text-sm line-clamp-3">{result.description}</p>
                {result.date && (
                  <p className="text-white/50 text-xs mt-3">
                    {new Date(result.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 