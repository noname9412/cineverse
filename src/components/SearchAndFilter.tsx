import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
interface SearchAndFilterProps {
  genres: { Id: string; Name: string }[];
  onSearchChange: (term: string) => void;
  onGenreChange: (genreId: string) => void;
}
export function SearchAndFilter({ genres, onSearchChange, onGenreChange }: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 p-4 text-lg bg-gray-800 border-gray-700 focus:ring-blue-500 tv-focusable h-14"
        />
      </div>
      <div className="w-full md:w-64">
        <Select onValueChange={onGenreChange}>
          <SelectTrigger className="w-full p-4 text-lg bg-gray-800 border-gray-700 focus:ring-blue-500 tv-focusable h-14">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.Id} value={genre.Id}>
                {genre.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}