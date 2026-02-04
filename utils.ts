
import { Photo } from './types';

export const getHighResUrl = (photo: Photo): string => {
  // Prioritize the explicit high-resolution source if available.
  if (photo.highResSrc) {
    return photo.highResSrc;
  }
  
  // Return the single source string
  return photo.src;
};
