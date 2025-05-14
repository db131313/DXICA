import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect } from 'react';
import type { SearchResult } from '../types';

interface CoverflowLayoutProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  settings: {
    cardHeight: number;
    fontSize: {
      title: number;
      description: number;
    };
  };
}

export default function CoverflowLayout({ results, onSelect, settings }: CoverflowLayoutProps) {
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
        
        slides.forEach((slide, index) => {
          const slideProgress = (scrollProgress - (index / slides.length)) * slides.length;
          const rotation = Math.min(Math.abs(slideProgress * 50), 45);
          const opacity = 1 - Math.abs(slideProgress * 0.5);
          const scale = 1 - Math.abs(slideProgress * 0.2);
          
          slide.style.transform = `
            perspective(1000px)
            rotateY(${slideProgress < 0 ? rotation : -rotation}deg)
            scale(${scale})
          `;
          slide.style.opacity = String(opacity);
        });
      });
    }
  }, [emblaApi]);

  return (
    <div className="relative px-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {results.map((result, index) => (
            <div 
              key={result.link}
              className="flex-[0_0_70%] min-w-0 pl-4 relative"
              style={{ perspective: '1000px' }}
            >
              <div 
                onClick={() => onSelect(result)}
                className="relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer"
              >
                <div className="relative aspect-[3/4]">
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

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 
                      className="text-white font-medium mb-2 line-clamp-2"
                      style={{ fontSize: `${settings.fontSize.title}px` }}
                    >
                      {result.title}
                    </h3>
                    <p 
                      className="text-white/70 line-clamp-2"
                      style={{ fontSize: `${settings.fontSize.description}px` }}
                    >
                      {result.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
      >
        <span className="material-icons">chevron_left</span>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
      >
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
} 