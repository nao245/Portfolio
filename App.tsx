
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
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
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionElements = useRef<HTMLElement[]>([]);
  const isSnapping = useRef(false);
  
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

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hero = container.querySelector('section') as HTMLElement;
    const photos = Array.from(container.querySelectorAll<HTMLElement>('[data-photoid]'));
    sectionElements.current = hero && photos.length > 0 ? [hero, ...photos] : [];

    setCurrentSnapIndex(prev => Math.min(prev, sectionElements.current.length - 1));
  }, [photos, isMobile]);

  const snapToElement = useCallback((index: number) => {
    const container = containerRef.current;
    const element = sectionElements.current[index];
    if (!container || !element) return;

    let targetScroll = 0;
    if (index === 0) {
        targetScroll = 0;
    } else {
        const grid = element.parentElement as HTMLElement;
        targetScroll = grid.offsetLeft + element.offsetLeft + element.offsetWidth / 2 - container.clientWidth / 2;
    }

    container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    if (sectionElements.current.length > 0) {
        snapToElement(currentSnapIndex);
    }
  }, [currentSnapIndex, snapToElement]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let snapTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
        if (isSnapping.current || sectionElements.current.length === 0) return;
        
        if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) === 0) return;
        
        const primaryDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

        e.preventDefault();
        isSnapping.current = true;
        snapTimeout = setTimeout(() => {
            isSnapping.current = false;
        }, 700);

        if (primaryDelta > 0) {
            setCurrentSnapIndex(prev => Math.min(prev + 1, sectionElements.current.length - 1));
        } else {
            setCurrentSnapIndex(prev => Math.max(prev - 1, 0));
        }
    };

    const handleScroll = () => {
        const heroSection = sectionElements.current[0];
        if (!heroSection) return;
        const heroSectionWidth = heroSection.clientWidth;
        if (heroSectionWidth > 0) {
            const progress = Math.min(container.scrollLeft / heroSectionWidth, 1);
            setScrollProgress(progress);
        }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(snapTimeout);
    };
  }, [photos, isMobile]);


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
            onClick={() => setCurrentSnapIndex(1)}
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
