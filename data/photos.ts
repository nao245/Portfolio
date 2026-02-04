
import { Photo } from '../types';

export const DEFAULT_HERO_PHOTO_ID = '1';

// 初期表示用の写真データ（説明文の中身をクリア）
export const initialPhotos: Photo[] = [
  {
    id: '1',
    src: '/images/photo-01.jpg',
    alt: 'Midnight City',
    location: '東京, 日本',
    date: '2024/05/12',
    camera: 'Sony A7R IV',
    lens: '35mm f/1.4',
    settings: '1/60s, f/1.4, ISO 800',
    description: ''
  },
  {
    id: '2',
    src: '/images/photo-02a.jpg',
    alt: 'Neon Horizon',
    location: '新宿',
    date: '2024/06/01',
    camera: 'Fujifilm X-T4',
    lens: '23mm f/2',
    settings: '1/125s, f/2.0, ISO 400',
    description: ''
  },
  {
    id: '3',
    src: '/images/photo-03.jpg',
    alt: 'Morning Dew',
    location: '長野',
    date: '2024/04/20',
    camera: 'Sony A7C',
    lens: '50mm f/1.8',
    settings: '1/1000s, f/2.8, ISO 100',
    description: ''
  },
  {
    id: '4',
    src: '/images/photo-04.jpg',
    alt: 'Urban Symmetry',
    location: '銀座',
    date: '2024/07/15',
    camera: 'Ricoh GR III',
    lens: '28mm f/2.8',
    settings: '1/250s, f/8.0, ISO 200',
    description: ''
  },
  {
    id: '5',
    src: '/images/photo-05.jpg',
    alt: 'Golden Hour',
    location: '江の島',
    date: '2024/08/05',
    camera: 'Sony A7S III',
    lens: '85mm f/1.4',
    settings: '1/4000s, f/1.4, ISO 100',
    description: ''
  }
];
