import { Photo } from '@/types/photo';
import { PhotoCard } from './PhotoCard';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div 
      className="photo-grid"
      role="list"
      aria-label="Photo gallery"
    >
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={() => onPhotoClick(photo)}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
