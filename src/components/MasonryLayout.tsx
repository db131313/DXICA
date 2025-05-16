import React from 'react';
import type { SearchResult } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MasonryLayoutProps {
  results: SearchResult[];
  settings: {
    layout: {
      columnCount: number;
      gridGap: number;
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
      };
      height: number;
    };
  };
  onCardClick: (result: SearchResult) => void;
  onCardDelete: (index: number) => void;
}

function MasonryCard({ result, index, settings, onCardClick, onCardDelete }: {
  result: SearchResult;
  index: number;
  settings: MasonryLayoutProps['settings'];
  onCardClick: (result: SearchResult) => void;
  onCardDelete: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: result.link });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="break-inside-avoid mb-4 group relative bg-white/5 backdrop-blur-sm overflow-hidden transition-all rounded-xl"
      {...attributes}
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
        <div className="p-4 space-y-2">
          <h3 
            className="font-medium text-white line-clamp-2"
            style={{ 
              fontFamily: `'${settings.card.font.family}', sans-serif`,
              fontSize: `${settings.card.font.size}px`,
              color: settings.card.font.color
            }}
          >
            {result.title}
          </h3>
          <p 
            className="text-white/80 line-clamp-1"
            style={{ 
              fontFamily: `'${settings.card.font.family}', sans-serif`,
              fontSize: `${settings.card.font.size * 0.875}px`,
              color: settings.card.font.color
            }}
          >
            {result.description}
          </p>
        </div>

        {/* Hover Controls */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCardClick(result);
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            {...listeners}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-move"
          >
            <span className="material-icons">drag_indicator</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCardDelete(index);
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>

        <a
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
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
        padding: 'inherit',
        width: '100%',
        maxWidth: '100vw',
        margin: '0 auto'
      }}
      className="w-full"
    >
      {results.map((result, index) => (
        <MasonryCard
          key={result.link}
          result={result}
          index={index}
          settings={settings}
          onCardClick={onCardClick}
          onCardDelete={onCardDelete}
        />
      ))}
    </div>
  );
} 