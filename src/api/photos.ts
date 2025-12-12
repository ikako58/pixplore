// Picsum Photos API Client - No API key required
import axios, { AxiosInstance } from 'axios';
import { Photo, PhotoQueryParams } from '@/types/photo';

const picsumApi: AxiosInstance = axios.create({
  baseURL: 'https://picsum.photos',
});

// Fetch list of photos
export const fetchPhotos = async (params: PhotoQueryParams): Promise<{
  photos: Photo[];
  total: number;
  totalPages: number;
}> => {
  const { page, per_page } = params;
  
  const response = await picsumApi.get<Photo[]>('/v2/list', {
    params: {
      page,
      limit: per_page,
    },
  });

  return {
    photos: response.data,
    total: 1000, // Picsum has ~1000 photos
    totalPages: Math.ceil(1000 / per_page),
  };
};

// Search photos by author name (client-side filter since Picsum doesn't have search)
export const searchPhotos = async (params: PhotoQueryParams): Promise<{
  photos: Photo[];
  total: number;
  totalPages: number;
}> => {
  const { query } = params;
  
  if (!query || query.trim().length < 2) {
    return { photos: [], total: 0, totalPages: 0 };
  }

  // Fetch more photos to filter from
  const response = await picsumApi.get<Photo[]>('/v2/list', {
    params: {
      page: 1,
      limit: 100,
    },
  });

  const filtered = response.data.filter(photo =>
    photo.author.toLowerCase().includes(query.toLowerCase())
  );

  return {
    photos: filtered.slice(0, 20),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / 20),
  };
};

// Fetch single photo by ID
export const fetchPhotoById = async (id: string): Promise<Photo> => {
  const response = await picsumApi.get<Photo>(`/id/${id}/info`);
  return response.data;
};

// Get image URL with specific dimensions
export const getImageUrl = (id: string, width: number, height?: number): string => {
  if (height) {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  }
  return `https://picsum.photos/id/${id}/${width}`;
};

// Error handling
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const axiosError = error as { message?: string };
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return 'An unexpected error occurred';
};

export const isRateLimitError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 429;
  }
  return false;
};

export default picsumApi;
