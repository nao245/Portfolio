
import React, { memo } from 'react';
import { Photo } from '../types';

interface PhotoItemProps {
  photo: Photo;
  onClick: () => void;
  isVisible: boolean;
  isCentered: boolean;
  isMobile: boolean;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick, isVisible, isCentered, isMobile }) => {
  const visibilityClass = isVisible ? "opacity-100" : "opacity-0";
  const glowClass = (isCentered && !isMobile) ? "opacity-25 animate-subtle-pulse" : "opacity-0";

  const transformStyle = {
    transform: `translateY(${isVisible ? '0' : '2.5rem'}) scale(${isVisible ? ((isCentered && !isMobile) ? 1.05 : 1.0) : 0.95})`,
  };

  return (
    <div 
      data-photoid={photo.id}
      className={`h-[40vh] sm:h-[50vh] max-w-[80vw] sm:max-w-none relative group cursor-pointer transition-all duration-700 ease-out flex-shrink-0 snap-center ${visibilityClass}`}
      style={transformStyle}
      onClick={onClick}
    >
      {/* Optimized white glow effect */}
      <div 
        className={`absolute inset-0 -z-10 bg-white blur-[70px] transition-opacity duration-1000 rounded-full scale-150 ${glowClass}`}
      ></div>

      {/* Frame */}
      <div className="h-full w-auto overflow-hidden border-[12px] border-[#0e1116] bg-[#0e1116] shadow-2xl transition-all duration-500 group-hover:-translate-y-4">
        <img 
          src={photo.src} 
          alt={photo.alt}
          className={`h-full w-auto object-contain`}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default memo(PhotoItem);