import { X, Download, ExternalLink, User, Maximize } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePhotoDetail, useCachedPhoto } from '@/hooks/usePhotos';
import { getImageUrl } from '@/api/photos';
import { Skeleton } from '@/components/ui/skeleton';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface PhotoModalProps {
  photoId: string | null;
  onClose: () => void;
}

export function PhotoModal({ photoId, onClose }: PhotoModalProps) {
  const { data: fetchedPhoto, isLoading, error } = usePhotoDetail(photoId);
  const cachedPhoto = useCachedPhoto(photoId || '');
  
  const photo = fetchedPhoto || cachedPhoto;

  if (!photoId) return null;

  return (
    <Dialog open={!!photoId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="modal-content">
        <VisuallyHidden>
          <DialogTitle>
            {photo ? `Photo by ${photo.author}` : 'Photo details'}
          </DialogTitle>
        </VisuallyHidden>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col lg:flex-row gap-6 max-h-[90vh] overflow-y-auto">
          {/* Image Section */}
          <div className="flex-1 min-h-0 flex items-center justify-center bg-muted/30 rounded-xl overflow-hidden">
            {isLoading && !photo ? (
              <Skeleton className="w-full aspect-video" />
            ) : photo ? (
              <img
                src={getImageUrl(photo.id, 800, 600)}
                alt={`Photo by ${photo.author}`}
                className="max-w-full max-h-[70vh] object-contain"
                loading="eager"
              />
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-destructive">Failed to load photo details</p>
              </div>
            ) : null}
          </div>

          {/* Details Section */}
          <div className="lg:w-80 flex flex-col gap-6 p-2">
            {photo ? (
              <>
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{photo.author}</p>
                    <p className="text-sm text-muted-foreground">Photographer</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm">{photo.width} × {photo.height}</span>
                  </div>
                </div>

                {/* Download Links */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Download</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Small', width: 640, height: 480 },
                      { label: 'Regular', width: 1280, height: 960 },
                      { label: 'Full', width: 1920, height: 1440 },
                    ].map(({ label, width, height }) => (
                      <a
                        key={label}
                        href={getImageUrl(photo.id, width, height)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Download className="w-3 h-3 mr-1" />
                          {label}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>

                {/* External Link */}
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Picsum
                </a>
              </>
            ) : isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-32" />
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
