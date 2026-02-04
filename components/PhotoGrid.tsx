
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, scrollContainerRef }) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

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
        root: container,
        rootMargin: '0px 200px 0px 200px',
        threshold: 0.1,
      }
    );

    const elements = Array.from(grid.children);
    elements.forEach((el) => observer.observe(el as HTMLElement));

    return () => observer.disconnect();
  }, [photos, scrollContainerRef]);

  return (
    <div ref={gridRef} className="flex-shrink-0 h-screen bg-[#050608] flex flex-nowrap items-center gap-16 sm:gap-32 px-8 sm:px-[20vw]">
      {photos.map((photo) => {
        return (
          <PhotoItem 
            key={photo.id} 
            photo={photo} 
            onClick={() => onPhotoClick(photo)}
            isVisible={visiblePhotos.has(photo.id)}
          />
        );
      })}
    </div>
  );
};

export default PhotoGrid;
