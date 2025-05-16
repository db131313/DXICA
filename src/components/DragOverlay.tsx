import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import type { SearchResult } from '../types';

interface DragOverlayProps {
  result: SearchResult;
  aspectRatio: string;
}

export default function DragOverlay({ result, aspectRatio }: DragOverlayProps) {
  return (
    <DndDragOverlay>
      <div className="fixed pointer-events-none shadow-2xl rounded-xl overflow-hidden transform scale-105 transition-transform z-50 w-64">
        <div className={`relative ${aspectRatio} overflow-hidden bg-black`}>
          <img
            src={result.image}
            alt={result.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-white text-sm line-clamp-1 font-medium">
              {result.description}
            </p>
          </div>

          <div className="absolute top-4 left-4">
            <img
              src={result.favicon}
              alt={result.source}
              className="w-10 h-10 rounded-full bg-black/20 p-1"
            />
          </div>
        </div>
      </div>
    </DndDragOverlay>
  );
} 