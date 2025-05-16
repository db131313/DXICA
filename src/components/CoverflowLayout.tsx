import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect } from 'react';
import type { SearchResult } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CoverflowLayoutProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onDelete: (index: number) => void;
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
        radius: number;
      };
      height: number;
    };
  };
}

function CoverflowCard({ result, index, settings, onSelect, onDelete }: {
  result: SearchResult;
  index: number;
  settings: CoverflowLayoutProps['settings'];
  onSelect: (result: SearchResult) => void;
  onDelete: (index: number) => void;
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
      className="flex-[0_0_70%] min-w-0 pl-4 relative"
      {...attributes}
    >
      <div 
        className="relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transition-all group"
        style={{
          borderWidth: `${settings.card.border.width}px`,
          borderColor: settings.card.border.color,
          borderStyle: 'solid',
          height: `${settings.card.height}px`,
          borderRadius: `${settings.card.border.radius}px`,
        }}
      >
        <div className="relative h-full">
          <img
            src={result.image}
            alt={result.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4">
            <img
              src={result.favicon}
              alt={result.source}
              className="w-10 h-10 rounded-full bg-black/20 p-1"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={result.favicon}
                alt={result.source}
                className="w-8 h-8 rounded-full bg-black/20 p-1"
              />
              <span 
                className="text-white/80"
                style={{ 
                  fontFamily: `'${settings.card.font.family}', sans-serif`,
                  fontSize: `${settings.card.font.size * 0.875}px`,
                  color: settings.card.font.color
                }}
              >
                {result.source}
              </span>
            </div>
            <h3 
              className="text-white font-medium mb-3 line-clamp-2"
              style={{ 
                fontFamily: `'${settings.card.font.family}', sans-serif`,
                fontSize: `${settings.card.font.size * 1.25}px`,
                color: settings.card.font.color
              }}
            >
              {result.title}
            </h3>
            <p 
              className="text-white/80 line-clamp-2"
              style={{ 
                fontFamily: `'${settings.card.font.family}', sans-serif`,
                fontSize: `${settings.card.font.size}px`,
                color: settings.card.font.color
              }}
            >
              {result.description}
            </p>
          </div>

          {/* Hover Controls */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(result);
              }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all"
            >
              <span className="material-icons text-sm">edit</span>
            </button>
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
            <button
              {...listeners}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all cursor-move"
            >
              <span className="material-icons text-sm">drag_indicator</span>
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
    </div>
  );
}

export default function CoverflowLayout({ results, onSelect, onDelete, settings }: CoverflowLayoutProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // Add 3D rotation effect
      emblaApi.on('scroll', () => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slides = emblaApi.slideNodes();
        
        slides.forEach((slide: HTMLElement, index: number) => {
          const slideProgress = (scrollProgress - (index / slides.length)) * slides.length;
          const rotation = Math.min(Math.abs(slideProgress * 50), 45);
          const opacity = 1 - Math.abs(slideProgress * 0.5);
          const scale = 1 - Math.abs(slideProgress * 0.2);
          const translateZ = -Math.abs(slideProgress * 100);
          
          slide.style.transform = `
            perspective(1000px)
            rotateY(${slideProgress < 0 ? rotation : -rotation}deg)
            scale(${scale})
            translateZ(${translateZ}px)
          `;
          slide.style.opacity = String(opacity);
          slide.style.zIndex = String(Math.round((1 - Math.abs(slideProgress)) * 100));
        });
      });
    }
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-[100vw] px-12 py-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {results.map((result, index) => (
            <CoverflowCard
              key={result.link}
              result={result}
              index={index}
              settings={settings}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
      >
        <span className="material-icons">chevron_left</span>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
      >
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
} 