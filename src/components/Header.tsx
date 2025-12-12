// Header component with logo and search
// Main navigation area of the application

import { Camera } from 'lucide-react';
import { SearchInput } from './SearchInput';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching?: boolean;
}

export function Header({ searchQuery, onSearchChange, isSearching }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            aria-label="Pixplore home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight">Pixplore</span>
          </a>

          {/* Search */}
          <div className="flex-1 w-full sm:w-auto flex justify-center">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search free high-resolution photos..."
              isLoading={isSearching}
            />
          </div>

          {/* Spacer for alignment */}
          <div className="hidden sm:block w-[120px]" />
        </div>
      </div>
    </header>
  );
}
