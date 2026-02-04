
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
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
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        // By not specifying a 'root', the observer defaults to the browser's viewport.
        // This is a more robust method for detecting visibility within a nested scroller.
        rootMargin: '0px 200px 0px 200px',
        threshold: 0.1,
      }
    );

    const elements = Array.from(grid.children);
    elements.forEach((el) => observer.observe(el as HTMLElement));

    return () => observer.disconnect();
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
          />
        );
      })}
    </div>
  );
};

export default PhotoGrid;