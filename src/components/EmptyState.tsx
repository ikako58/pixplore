// Empty state component for no results
// Provides helpful messaging when search returns no photos

import { ImageOff, Search } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
  type?: 'no-results' | 'error' | 'rate-limit';
  message?: string;
}

export function EmptyState({ query, type = 'no-results', message }: EmptyStateProps) {
  const isSearch = !!query;

  const content = {
    'no-results': {
      icon: isSearch ? Search : ImageOff,
      title: isSearch ? 'No photos found' : 'No photos available',
      description: isSearch
        ? `We couldn't find any photos matching "${query}". Try a different search term.`
        : 'There are no photos to display at the moment.',
    },
    'error': {
      icon: ImageOff,
      title: 'Something went wrong',
      description: message || 'Failed to load photos. Please try again later.',
    },
    'rate-limit': {
      icon: ImageOff,
      title: 'Rate limit exceeded',
      description: 'Too many requests. Please wait a moment and try again.',
    },
  };

  const { icon: Icon, title, description } = content[type];

  return (
    <div 
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
