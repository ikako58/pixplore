import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Photo } from '@/types/photo';
import { getImageUrl } from '@/api/photos';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  priority?: boolean;
}

export function PhotoCard({ photo, onClick, priority = false }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatio = photo.height / photo.width;
  const isPortrait = aspectRatio > 1.2;
  const isLandscape = aspectRatio < 0.8;

  return (
    <article
      className={cn(
        "photo-card group relative overflow-hidden rounded-xl cursor-pointer",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
        isPortrait && "row-span-2",
        isLandscape && "col-span-2 sm:col-span-1"
      )}
      style={{ 
        aspectRatio: isPortrait ? '3/4' : '4/3'
      }}
    >
      <button
        onClick={onClick}
        className="w-full h-full focus:outline-none"
        aria-label={`View photo by ${photo.author}`}
      >
        {!hasError && (
          <img
            src={getImageUrl(photo.id, 400, 300)}
            alt={`Photo by ${photo.author}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              "group-hover:scale-105",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        
        {/* Overlay on hover */}
        <div className="photo-overlay">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-medium">
                {photo.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {photo.author}
                </p>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <Heart className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{photo.width}×{photo.height}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
      </button>
    </article>
  );
}
