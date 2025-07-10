'use client';

import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Search({ setSearch, setLocation }: { setSearch: (search: string) => void; setLocation: (location: string) => void; }) {

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  const handleLocationChange = (location: string) => {
    setLocation(location);
  };

  return (
    <div className="flex items-center space-x-4">
      <Input
        placeholder="Search by university name..."
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-grow"
      />
      <Select onValueChange={handleLocationChange} defaultValue='all'>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="uk">UK</SelectItem>
          <SelectItem value="overseas">Overseas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 