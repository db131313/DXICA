import React from 'react';
import type { SearchResult } from '../types';

interface CardModalProps {
  result: SearchResult;
  onClose: () => void;
  settings?: {
    card: {
      font: {
        family: string;
        size: number;
        color: string;
      };
    };
  };
}

export default function CardModal({ result, onClose, settings }: CardModalProps) {
  const fontStyles = settings?.card.font ? {
    fontFamily: settings.card.font.family,
    color: settings.card.font.color,
  } : {};

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-h-[90vh] bg-black/80 backdrop-blur-md rounded-xl border border-white/20 p-6 z-50 overflow-y-auto max-w-2xl mx-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <span className="material-icons">close</span>
        </button>

        <div className="space-y-6">
          {result.image && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={result.favicon} alt="" className="w-6 h-6" />
              <span 
                className="text-white/80"
                style={fontStyles}
              >
                {result.source}
              </span>
            </div>

            <h2 
              className="text-xl font-medium text-white"
              style={fontStyles}
            >
              {result.title}
            </h2>
            
            <p 
              className="text-white/60 leading-relaxed"
              style={fontStyles}
            >
              {result.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                style={fontStyles}
              >
                <span className="material-icons text-sm">open_in_new</span>
                Visit Original
              </a>
              {result.date && (
                <div 
                  className="text-white/40 text-sm"
                  style={fontStyles}
                >
                  Published: {new Date(result.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 