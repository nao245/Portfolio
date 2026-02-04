
import React from 'react';
import { Photo } from '../types';

interface PhotoItemProps {
  photo: Photo;
  onClick: () => void;
  isVisible: boolean;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick, isVisible }) => {
  const visibilityClass = isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95";

  return (
    <div 
      data-photoid={photo.id}
      className={`h-[45vh] sm:h-[55vh] relative group cursor-pointer transition-all duration-700 ease-out flex-shrink-0 ${visibilityClass}`}
      onClick={onClick}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 -z-10 bg-orange-500/20 blur-[40px] transition-opacity duration-300 rounded-full scale-125 opacity-0 group-hover:opacity-100"></div>

      {/* Frame */}
      <div className="h-full w-auto overflow-hidden border-[12px] border-[#0e1116] bg-[#0e1116] shadow-2xl transition-all duration-500 group-hover:-translate-y-6 group-hover:shadow-[0_0_60px_rgba(249,115,22,0.25)]">
        <img 
          src={photo.src} 
          alt={photo.alt}
          className="h-full w-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          loading="lazy"
        />
        {/* Inner glow */}
        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-500 pointer-events-none"></div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-14 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <p className="text-orange-500 text-[8px] font-bold uppercase tracking-[0.3em] mb-1">{photo.location || 'COLLECTION'}</p>
        <h3 className="text-white text-xl font-playfair font-bold whitespace-nowrap">{photo.alt}</h3>
      </div>
    </div>
  );
};

export default PhotoItem;
