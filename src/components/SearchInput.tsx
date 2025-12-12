// Search input component with debounced value
// Implements accessibility with proper ARIA attributes

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search by author name...', 
  isLoading = false 
}: SearchInputProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative w-full max-w-md group">
      <div className="relative flex items-center">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-orange-500" aria-hidden="true" />
        </div>
        
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full pl-12 pr-12 rounded-full bg-secondary/80 border border-border/50 
                     backdrop-blur-sm shadow-sm
                     focus:border-primary/50 focus:bg-secondary focus:ring-2 focus:ring-primary/20
                     placeholder:text-muted-foreground/70 
                     transition-all duration-300 ease-out"
          aria-label="Search photos by author"
          aria-describedby="search-hint"
        />
        
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        
        {/* Clear button */}
        {value && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full
                       text-muted-foreground hover:text-foreground hover:bg-muted
                       transition-colors duration-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <span id="search-hint" className="sr-only">
        Type at least 2 characters to search by author name. Results update automatically.
      </span>
    </div>
  );
}
