
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
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
      if (window.innerWidth < 768) { // Tablets and mobile
        return '0% -25% 0% -25%'; // Detects center in the middle 50% of the viewport
      }
      return '0% -40% 0% -40%'; // Detects center in the middle 20% of the viewport for desktop
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
        threshold: 0.5, // At least 50% of the element must be in the strip to be "centered"
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
    <div ref={gridRef} className="flex-shrink-0 h-screen bg-[#050608] flex flex-nowrap items-center gap-16 sm:gap-32 px-8 sm:px-[20vw]">
      {photos.map((photo, index) => {
        return (
          <PhotoItem 
            key={photo.id} 
            photo={photo} 
            onClick={() => onPhotoClick(index)}
            isVisible={visiblePhotos.has(photo.id)}
            isCentered={centeredPhotoId === photo.id}
          />
        );
      })}
    </div>
  );
};

export default PhotoGrid;