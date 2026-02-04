
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
  const intersectingElementsRef = useRef(new Map<Element, number>());

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
        return '0% -35% 0% -35%'; // Detection area in the middle 30% of the screen
      }
      return '0% -40% 0% -40%'; // Detection area in the middle 20% of the screen
    };
    
    const intersectingElements = intersectingElementsRef.current;
    intersectingElements.clear();

    const updateCenteredPhoto = () => {
        let maxRatio = 0;
        let centeredElement: Element | null = null;
        
        intersectingElements.forEach((ratio, element) => {
            if (ratio > maxRatio) {
                maxRatio = ratio;
                centeredElement = element;
            }
        });
        
        const newCenteredId = centeredElement ? (centeredElement as HTMLElement).dataset.photoid || null : null;
        setCenteredPhotoId(currentId => (currentId !== newCenteredId ? newCenteredId : currentId));
    };


    // Observer for centered glow effect
    const centerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                intersectingElements.set(entry.target, entry.intersectionRatio);
            } else {
                intersectingElements.delete(entry.target);
            }
        });
        updateCenteredPhoto();
      },
      {
        root: null, // viewport
        rootMargin: getCenterObserverMargin(),
        // An array of thresholds from 0.0 to 1.0. This makes the observer fire
        // whenever the intersection ratio crosses one of these values, effectively
        // giving us continuous updates to find the most centered item.
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
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
