
export interface Photo {
  id: string;
  src: string; // Single image source
  highResSrc?: string; // Optional high-resolution source for hero image
  alt: string; // Serves as the title
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
  settings?: string;
  description?: string;
}
