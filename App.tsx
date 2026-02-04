
import React, { useState, useRef, useEffect } from 'react';
import { Photo } from './types';
import PhotoGrid from './components/PhotoGrid';
import Modal from './components/Modal';
import { getHighResUrl } from './utils';
import { initialPhotos, DEFAULT_HERO_PHOTO_ID } from './data/photos';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

const App: React.FC = () => {
  // Owner mode state and handlers are removed. Photos are now read-only.
  const [photos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // The hero image is determined once on load and doesn't change.
  const [heroImageUrl] = useState(() => {
    const hero = initialPhotos.find(p => p.id === DEFAULT_HERO_PHOTO_ID);
    return getHighResUrl(hero || initialPhotos[0]);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Calculate progress (title animation completes within the first 40% of the viewport width)
      const progress = Math.min(container.scrollLeft / (window.innerWidth * 0.4), 1);
      setScrollProgress(progress);
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow vertical scrolling to control horizontal movement for better UX.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    // Owner mode keydown listener is removed.
    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
    };
  }, []); // Dependency array is now empty.

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050608] text-gray-100 font-lato select-none">
      
      <div 
        className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center"
        style={{
          transform: `translate3d(0, ${-scrollProgress * 38}vh, 0)`,
        }}
      >
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl font-bold font-playfair tracking-[0.15em] text-white"
          style={{
            transform: `scale(${1 - (scrollProgress * 0.7)})`,
          }}
        >
          Gallery
        </h1>
        <p 
          className="text-xs tracking-[0.4em] uppercase text-orange-500 font-bold mt-4"
          style={{ 
            transform: `translateY(${scrollProgress * 76}vh) scale(${1 - (scrollProgress * 0.3)})`
          }}
        >
          by Nao
        </p>
      </div>

      <div 
        ref={containerRef}
        className="h-full w-full overflow-x-auto overflow-y-hidden flex flex-nowrap scroll-smooth no-scrollbar"
      >
        {/* Cover */}
        <section className="h-screen min-w-[100vw] relative flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-[#050608]"></div>
          <button 
            onClick={() => containerRef.current?.scrollTo({ left: window.innerWidth, behavior: 'smooth' })}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-orange-500 transition-colors"
          >
            <div className="rotate-[-90deg]"><ChevronDownIcon /></div>
          </button>
        </section>

        {/* Gallery Items */}
        <PhotoGrid 
          photos={photos} 
          onPhotoClick={setSelectedPhoto}
          scrollContainerRef={containerRef}
        />
      </div>

      {/* Owner mode UI (buttons) is removed. */}

      {selectedPhoto && (
        <Modal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* PasscodeModal is removed. */}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
