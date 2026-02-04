
import React, { useEffect } from 'react';
import { Photo } from '../types';
import XIcon from './icons/XIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import CalendarIcon from './icons/CalendarIcon';
import CameraIcon from './icons/CameraIcon';
import SettingsIcon from './icons/SettingsIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ModalProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Modal: React.FC<ModalProps> = ({ photos, currentIndex, onClose, onNext, onPrev }) => {
  const photo = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string; isTextarea?: boolean; }> = ({ icon, label, value, isTextarea = false }) => {
    if (!value && label !== "作品解説") {
      return null;
    }

    return (
        <div className={`flex ${isTextarea ? 'items-start' : 'items-center'} group/row`}>
            <div className="mr-4 text-gray-600 flex-shrink-0 group-hover/row:text-orange-400 transition-colors">{icon}</div>
            <div className="w-full">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="break-words w-full text-gray-300 text-sm whitespace-pre-line">
                    {value || (isTextarea ? '解説はありません' : '未設定')}
                </p>
            </div>
        </div>
    );
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative bg-[#0a0c10] border border-white/5 rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-6xl w-full max-h-[90vh] animate-scale-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Side */}
        <div className="w-full md:w-2/3 h-[45vh] md:h-auto flex items-center justify-center bg-black/20 relative overflow-hidden group/img">
          <img 
            src={photo.src}
            alt={photo.alt}
            className="max-w-full max-h-full object-contain p-4 transition-transform duration-1000 group-hover/img:scale-105"
          />
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/3 p-8 md:p-10 flex flex-col text-gray-300 overflow-y-auto bg-[#0d1016]">
          <div className="flex justify-between items-start mb-8">
            <h2 id="modal-title" className="flex-1 text-3xl font-bold text-white font-playfair leading-tight pr-4 tracking-tight">{photo.alt}</h2>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <InfoRow icon={<LocationMarkerIcon className="w-5 h-5" />} label="撮影場所" value={photo.location} />
              <InfoRow icon={<CalendarIcon className="w-5 h-5" />} label="撮影日" value={photo.date} />
            </div>
            
            <div className="space-y-6 pt-8 border-t border-white/5">
              <InfoRow 
                icon={<CameraIcon className="w-5 h-5" />} 
                label="使用機材" 
                value={`${photo.camera || ''}${photo.lens ? `\n${photo.lens}` : ''}`}
              />
              <InfoRow icon={<SettingsIcon className="w-5 h-5" />} label="撮影設定 (EXIF)" value={photo.settings} />
            </div>

            <div className="pt-8 border-t border-white/5">
              <InfoRow icon={<></>} label="作品解説" value={photo.description} isTextarea />
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/30 hover:text-white transition-all z-50 p-4 rounded-full hover:bg-white/5"
        aria-label="閉じる"
      >
        <XIcon />
      </button>

      {/* Prev Button */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white hover:bg-white/10 p-3 sm:p-4 rounded-full transition-all"
          aria-label="前の写真へ"
        >
          <ChevronLeftIcon />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white hover:bg-white/10 p-3 sm:p-4 rounded-full transition-all"
          aria-label="次の写真へ"
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
};

export default Modal;