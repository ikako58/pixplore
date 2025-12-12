// Photo types for Picsum API

export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface PhotoQueryParams {
  page: number;
  per_page: number;
  query?: string;
}
