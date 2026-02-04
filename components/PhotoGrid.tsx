
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  isMobile: boolean;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, isMobile }) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const [centeredPhotoId, setCenteredPhotoId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Observer for fade-in visibility
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.photoid;
            if (id) {
              setVisiblePhotos((prev) => {
                if (prev.has(id)) return prev;
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
              });
              visibilityObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '0px 200px 0px 200px',
        threshold: 0.1,
      }
    );
    
    const getCenterObserverMargin = () => {
      // Use a robust check for touch primary input devices (covers tablets and phones)
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      if (isTouchDevice) {
        return '0% -35% 0% -35%'; // Narrower detection area for touch screens (middle 30%)
      }
      return '0% -40% 0% -40%'; // Narrower detection area for mouse-driven devices (middle 20%)
    };

    // Observer for centered glow effect
    const centerObserver = new IntersectionObserver(
      (entries) => {
        setCenteredPhotoId(currentCenteredId => {
          const newlyCenteredEntry = entries.find(e => e.isIntersecting);
          if (newlyCenteredEntry) {
            return (newlyCenteredEntry.target as HTMLElement).dataset.photoid || null;
          }
          const currentEntryIsLeaving = entries.some(e => 
            (e.target as HTMLElement).dataset.photoid === currentCenteredId && !e.isIntersecting
          );
          if (currentEntryIsLeaving) {
            return null;
          }
          return currentCenteredId;
        });
      },
      {
        root: null, // viewport
        rootMargin: getCenterObserverMargin(),
        threshold: 0.75, // Stricter threshold to prevent flickering on scroll settle
      }
    );

    const elements = Array.from(grid.children);
    elements.forEach((el) => {
      visibilityObserver.observe(el as HTMLElement);
      centerObserver.observe(el as HTMLElement);
    });

    return () => {
      visibilityObserver.disconnect();
      centerObserver.disconnect();
    };
  }, [photos]);

  return (
    <div ref={gridRef} className="flex-shrink-0 h-screen bg-[#050608] flex flex-nowrap items-center gap-16 sm:gap-32 pl-8 sm:pl-[20vw] pr-8 sm:pr-[40vw]">
      {photos.map((photo, index) => {
        return (
          <PhotoItem 
            key={photo.id} 
            photo={photo} 
            onClick={() => onPhotoClick(index)}
            isVisible={visiblePhotos.has(photo.id)}
            isCentered={centeredPhotoId === photo.id}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
};

export default PhotoGrid;
