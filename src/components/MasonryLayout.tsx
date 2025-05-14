import React from 'react';
import type { SearchResult } from '../types';

interface MasonryLayoutProps {
  results: SearchResult[];
  settings: {
    layout: {
      columnCount: number;
      gridGap: number;
    };
    card: {
      border: {
        width: number;
        color: string;
      };
      borderRadius: number;
      font: {
        family: string;
        size: number;
      };
    };
  };
  onCardClick: (result: SearchResult) => void;
  onCardDelete: (index: number) => void;
}

export default function MasonryLayout({
  results,
  settings,
  onCardClick,
  onCardDelete
}: MasonryLayoutProps) {
  return (
    <div
      style={{
        columnCount: settings.layout.columnCount,
        columnGap: `${settings.layout.gridGap}px`,
        padding: 'inherit'
      }}
    >
      {results.map((result, index) => (
        <div
          key={index}
          className="break-inside-avoid mb-4 group relative bg-white/5 backdrop-blur-sm overflow-hidden transition-all"
          style={{
            borderWidth: `${settings.card.border.width}px`,
            borderColor: settings.card.border.color,
            borderStyle: 'solid',
            borderRadius: `${settings.card.borderRadius}px`,
            fontFamily: settings.card.font.family,
            fontSize: `${settings.card.font.size}px`,
          }}
        >
          <div className="relative">
            {result.image && (
              <div className="w-full overflow-hidden">
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <img src={result.favicon} alt="" className="w-4 h-4" />
                <span className="text-sm text-white/60">{result.source}</span>
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">{result.title}</h3>
              <p className="text-white/60 line-clamp-3" style={{ fontSize: `${settings.card.font.size * 0.875}px` }}>
                {result.description}
              </p>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: `${settings.card.font.size * 0.875}px` }}
              >
                View Original →
              </a>
            </div>

            {/* Hover Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                onClick={() => onCardClick(result)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
              >
                <span className="material-icons">edit</span>
              </button>
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-move"
              >
                <span className="material-icons">drag_indicator</span>
              </button>
              <button
                onClick={() => onCardDelete(index)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 