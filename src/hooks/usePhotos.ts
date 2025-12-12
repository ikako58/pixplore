// React Query hooks for fetching photos from Picsum

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPhotos, searchPhotos, fetchPhotoById, isRateLimitError } from '@/api/photos';
import { Photo } from '@/types/photo';

const PHOTOS_PER_PAGE = 20;

const CACHE_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 60, // 1 hour
  refetchOnWindowFocus: false,
  retry: (failureCount: number, error: unknown) => {
    if (isRateLimitError(error)) return false;
    return failureCount < 3;
  },
};

export const photoKeys = {
  all: ['photos'] as const,
  lists: () => [...photoKeys.all, 'list'] as const,
  list: (page: number) => [...photoKeys.lists(), { page }] as const,
  searches: () => [...photoKeys.all, 'search'] as const,
  search: (query: string, page: number) => [...photoKeys.searches(), { query, page }] as const,
  details: () => [...photoKeys.all, 'detail'] as const,
  detail: (id: string) => [...photoKeys.details(), id] as const,
};

export function usePhotoList(page: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: photoKeys.list(page),
    queryFn: () => fetchPhotos({ page, per_page: PHOTOS_PER_PAGE }),
    ...CACHE_CONFIG,
  });

  const prefetchNextPage = () => {
    queryClient.prefetchQuery({
      queryKey: photoKeys.list(page + 1),
      queryFn: () => fetchPhotos({ page: page + 1, per_page: PHOTOS_PER_PAGE }),
      ...CACHE_CONFIG,
    });
  };

  return {
    ...query,
    prefetchNextPage,
  };
}

export function usePhotoSearch(query: string, page: number) {
  const queryClient = useQueryClient();
  const trimmedQuery = query.trim();
  const isValidQuery = trimmedQuery.length >= 2;

  const searchQuery = useQuery({
    queryKey: photoKeys.search(trimmedQuery, page),
    queryFn: () => searchPhotos({ page, per_page: PHOTOS_PER_PAGE, query: trimmedQuery }),
    enabled: isValidQuery,
    ...CACHE_CONFIG,
  });

  const prefetchNextPage = () => {
    if (isValidQuery) {
      queryClient.prefetchQuery({
        queryKey: photoKeys.search(trimmedQuery, page + 1),
        queryFn: () => searchPhotos({ page: page + 1, per_page: PHOTOS_PER_PAGE, query: trimmedQuery }),
        ...CACHE_CONFIG,
      });
    }
  };

  return {
    ...searchQuery,
    prefetchNextPage,
    isValidQuery,
  };
}

export function usePhotoDetail(id: string | null) {
  return useQuery({
    queryKey: photoKeys.detail(id || ''),
    queryFn: () => fetchPhotoById(id!),
    enabled: !!id,
    ...CACHE_CONFIG,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCachedPhoto(id: string): Photo | undefined {
  const queryClient = useQueryClient();
  
  const cachedDetail = queryClient.getQueryData<Photo>(photoKeys.detail(id));
  if (cachedDetail) return cachedDetail;

  const allQueries = queryClient.getQueriesData<{ photos: Photo[] }>({
    queryKey: photoKeys.all,
  });

  for (const [, data] of allQueries) {
    if (data?.photos) {
      const found = data.photos.find(photo => photo.id === id);
      if (found) return found;
    }
  }

  return undefined;
}
