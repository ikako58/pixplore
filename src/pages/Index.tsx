// Main page component
// Implements photo browsing with search, pagination, and modal

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoModal } from '@/components/PhotoModal';
import { Pagination } from '@/components/Pagination';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';
import { usePhotoList, usePhotoSearch } from '@/hooks/usePhotos';
import { Photo } from '@/types/photo';
import { isRateLimitError, getErrorMessage } from '@/api/photos';
import { Images } from 'lucide-react';

const DEBOUNCE_DELAY = 300;
const MIN_QUERY_LENGTH = 2;

const Index = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Debounced search query
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const isSearchMode = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  // Fetch photos based on mode
  const listQuery = usePhotoList(currentPage);
  const searchQueryResult = usePhotoSearch(debouncedQuery, currentPage);

  // Select active query based on mode
  const activeQuery = isSearchMode ? searchQueryResult : listQuery;
  const { data, isLoading, isFetching, error, prefetchNextPage } = activeQuery;

  // Handle photo click
  const handlePhotoClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Determine display state
  const photos = data?.photos || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.total || 0;
  const isRateLimit = error && isRateLimitError(error);

  return (
    <div className="page-container">
      {/* Header with search */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isFetching && isSearchMode}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Results info */}
        {isSearchMode && !isLoading && photos.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="results-badge">
              <Images className="w-4 h-4" aria-hidden="true" />
              <span>
                {totalResults.toLocaleString()} photos found for "{debouncedQuery}"
              </span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <LoadingState />}

        {/* Error state */}
        {error && !isLoading && (
          <EmptyState
            type={isRateLimit ? 'rate-limit' : 'error'}
            message={getErrorMessage(error)}
          />
        )}

        {/* Empty state */}
        {!isLoading && !error && photos.length === 0 && isSearchMode && (
          <EmptyState type="no-results" query={debouncedQuery} />
        )}

        {/* Photo grid */}
        {!isLoading && !error && photos.length > 0 && (
          <>
            <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.min(totalPages, 50)}
                  onPageChange={handlePageChange}
                  onHoverNext={prefetchNextPage}
                  disabled={isFetching}
                />
              </div>
            )}
          </>
        )}

        {/* Loading more indicator */}
        {isFetching && !isLoading && (
          <div className="fixed bottom-4 right-4 px-4 py-2 bg-card rounded-full shadow-lg border border-border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
        )}
      </main>

      {/* Photo detail modal */}
      <PhotoModal
        photoId={selectedPhoto?.id || null}
        onClose={handleModalClose}
      />

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a
              href="https://picsum.photos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lorem Picsum
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
