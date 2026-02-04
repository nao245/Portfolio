
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Photo } from './types';
import PhotoGrid from './components/PhotoGrid';
import Modal from './components/Modal';
import { getHighResUrl } from './utils';
import { initialPhotos, DEFAULT_HERO_PHOTO_ID } from './data/photos';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

const App: React.FC = () => {
  const [photos] = useState<Photo[]>(initialPhotos);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [heroImageUrl] = useState(() => {
    const hero = initialPhotos.find(p => p.id === DEFAULT_HERO_PHOTO_ID);
    return getHighResUrl(hero || initialPhotos[0]);
  });

  const handleSelectPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const progress = Math.min(container.scrollLeft / (window.innerWidth * 0.4), 1);
      setScrollProgress(progress);
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
            aria-label="Scroll to gallery"
          >
            <div className="rotate-[-90deg]"><ChevronDownIcon /></div>
          </button>
        </section>

        {/* Gallery Items */}
        <PhotoGrid 
          photos={photos} 
          onPhotoClick={handleSelectPhoto}
          isMobile={isMobile}
        />
      </div>

      {selectedPhotoIndex !== null && (
        <Modal 
          photos={photos}
          currentIndex={selectedPhotoIndex}
          onClose={handleCloseModal}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
