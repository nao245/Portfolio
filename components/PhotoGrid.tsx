
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
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      if (isTouchDevice) {
        return '0% -35% 0% -35%'; // Detection area in the middle 30% of the screen
      }
      return '0% -40% 0% -40%'; // Detection area in the middle 20% of the screen
    };
    
    // Optimized observer for centered glow effect
    const centerObserver = new IntersectionObserver(
      (entries) => {
        // From all intersecting entries, find the one with the largest intersection area.
        const centeredEntry = entries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });

        if (centeredEntry && centeredEntry.intersectionRatio > 0.1) { // Ensure it's significantly visible
          const newCenteredId = (centeredEntry.target as HTMLElement).dataset.photoid || null;
          // Only update state if the centered photo has actually changed to prevent unnecessary re-renders.
          setCenteredPhotoId(currentId => (currentId !== newCenteredId ? newCenteredId : currentId));
        }
      },
      {
        root: null, // viewport
        rootMargin: getCenterObserverMargin(),
        // Check at a few key points instead of 101 times. This is a huge performance gain.
        threshold: [0.25, 0.5, 0.75, 1.0],
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