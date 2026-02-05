
import React, { useState, useRef, useEffect } from 'react';
import { Photo } from './types';
import PhotoGrid from './components/PhotoGrid';
import Modal from './components/Modal';
import { getHighResUrl } from './utils';
import { initialPhotos, DEFAULT_HERO_PHOTO_ID } from './data/photos';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

const App: React.FC = () => {
  const [photos] = useState<Photo[]>(initialPhotos);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  
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

  const scrollToGallery = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      left: container.clientWidth,
      behavior: 'smooth',
    });
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
      const heroSectionWidth = container.clientWidth;
      if (heroSectionWidth > 0) {
        const progress = Math.min(container.scrollLeft / heroSectionWidth, 1);
        
        // Direct DOM manipulation for performance
        if (headerRef.current) {
          headerRef.current.style.transform = `translate3d(0, ${-progress * 35}dvh, 0)`;
        }
        if (h1Ref.current) {
          h1Ref.current.style.transform = `scale(${1 - (progress * 0.7)})`;
        }
        if (pRef.current) {
          pRef.current.style.transform = `translateY(${progress * 70}dvh) scale(${1 - (progress * 0.3)})`;
        }
      }
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-[#050608] text-gray-100 font-lato select-none relative">
      
      {/* Dynamic Overlay Header */}
      <div 
        ref={headerRef}
        className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        <h1 
          ref={h1Ref}
          className="text-6xl sm:text-7xl md:text-8xl font-bold font-playfair tracking-[0.15em] text-white"
          style={{ willChange: 'transform' }}
        >
          Gallery
        </h1>
        <p 
          ref={pRef}
          className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-orange-500 font-bold mt-2"
          style={{ willChange: 'transform' }}
        >
          by Nao
        </p>
      </div>

      <div 
        ref={containerRef}
        className="h-full w-full overflow-x-auto overflow-y-hidden flex flex-nowrap scroll-smooth no-scrollbar snap-x snap-mandatory"
      >
        {/* Cover Section */}
        <section className="h-full min-w-[100vw] relative flex-shrink-0 snap-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-[#050608]"></div>
          <button 
            onClick={scrollToGallery}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-orange-500 transition-colors"
            aria-label="Scroll to gallery"
          >
            <div className="rotate-[-90deg]"><ChevronDownIcon /></div>
          </button>
        </section>

        {/* Gallery Content */}
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