import React from 'react';
import type { SearchResult } from '../types';

interface CardModalProps {
  result: SearchResult;
  onClose: () => void;
}

export default function CardModal({ result, onClose }: CardModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-12 lg:inset-24 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 p-6 z-50 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <span className="material-icons">close</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {result.image && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
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
              <span className="text-lg text-white/60">{result.source}</span>
            </div>

            <h2 className="text-2xl font-semibold">{result.title}</h2>
            
            <p className="text-white/60 text-lg leading-relaxed">
              {result.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span className="material-icons">open_in_new</span>
                Visit Original
              </a>
              {result.date && (
                <div className="text-white/40">
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