import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SearchResult } from '../types';

interface SortableItemProps {
  id: string;
  result: SearchResult;
  index: number;
  settings: {
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
  };
  onEdit?: (result: SearchResult) => void;
  onDelete?: (index: number) => void;
}

export default function SortableItem({ id, result, index, settings, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
    borderRadius: `${settings.card.border.radius}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden"
      {...attributes}
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
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2">
          <img src={result.favicon} alt="" className="w-6 h-6" />
          <span 
            className="text-white/80 text-sm"
            style={{ 
              fontFamily: `'${settings.card.font.family}', sans-serif`,
              color: settings.card.font.color
            }}
          >
            {result.source}
          </span>
        </div>
        
        <h3 
          className="font-medium mb-2 line-clamp-2"
          style={{ 
            fontFamily: `'${settings.card.font.family}', sans-serif`,
            fontSize: `${settings.card.font.size}px`,
            color: settings.card.font.color
          }}
        >
          {result.title}
        </h3>
        
        <p 
          className="line-clamp-2"
          style={{ 
            fontFamily: `'${settings.card.font.family}', sans-serif`,
            fontSize: `${settings.card.font.size * 0.875}px`,
            color: settings.card.font.color
          }}
        >
          {result.description}
        </p>

        {/* Hover Controls */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(result);
              }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all"
            >
              <span className="material-icons text-sm">edit</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(index);
              }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all"
            >
              <span className="material-icons text-sm">delete</span>
            </button>
          )}
          <button
            {...listeners}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all cursor-move"
          >
            <span className="material-icons text-sm">drag_indicator</span>
          </button>
        </div>

        {/* Link to original content */}
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