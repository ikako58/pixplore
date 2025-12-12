// Loading state component with skeleton grid
// Shows placeholder cards while photos are loading

import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  count?: number;
}

export function LoadingState({ count = 12 }: LoadingStateProps) {
  return (
    <div 
      className="photo-grid"
      aria-label="Loading photos"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden"
          style={{ aspectRatio: index % 3 === 0 ? '3/4' : '4/3' }}
        >
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}
