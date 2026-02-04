
import React from 'react';
import { Photo } from '../types';

interface PhotoItemProps {
  photo: Photo;
  onClick: () => void;
  isVisible: boolean;
  isCentered: boolean;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick, isVisible, isCentered }) => {
  const visibilityClass = isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95";
  const glowClass = isCentered ? "opacity-100" : "opacity-0";

  return (
    <div 
      data-photoid={photo.id}
      className={`h-[40vh] sm:h-[50vh] relative group cursor-pointer transition-all duration-700 ease-out flex-shrink-0 ${visibilityClass}`}
      onClick={onClick}
    >
      {/* New white glow based on scroll position */}
      <div className={`absolute inset-0 -z-10 bg-white/20 blur-[60px] transition-opacity duration-1000 rounded-full scale-150 ${glowClass}`}></div>

      {/* Frame - Re-added subtle hover lift effect */}
      <div className="h-full w-auto overflow-hidden border-[12px] border-[#0e1116] bg-[#0e1116] shadow-2xl transition-all duration-500 group-hover:-translate-y-4">
        <img 
          src={photo.src} 
          alt={photo.alt}
          className="h-full w-auto object-cover transition-all duration-700"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default PhotoItem;
