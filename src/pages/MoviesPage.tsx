import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTvNavigation } from '@/hooks/use-tv-navigation';
import { useSettingsStore } from '@/store/settings';
import { jellyfinApi } from '@/lib/jellyfin-api';
import { MediaItem, JellyfinItemsResponse } from '@/lib/types';
import { MediaGrid } from '@/components/MediaGrid';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDebounce } from 'react-use';
const PageSkeleton = () => (
  <div className="p-6 md:p-8 space-y-8">
    <div className="flex flex-col md:flex-row gap-4">
      <Skeleton className="h-14 flex-1" />
      <Skeleton className="h-14 w-full md:w-64" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
      {Array.from({ length: 14 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-[2/3]" />
      ))}
    </div>
  </div>
);
export function MoviesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useTvNavigation(pageRef);
  const { userId } = useSettingsStore();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<{ Id: string; Name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const [itemsResponse, genresResponse] = await Promise.all([
          jellyfinApi.get<JellyfinItemsResponse<MediaItem>>(`/Users/${userId}/Items?IncludeItemTypes=Movie&Recursive=true&Fields=PrimaryImageAspectRatio,Genres`),
          jellyfinApi.getGenres(),
        ]);
        setItems(itemsResponse.Items);
        setGenres(genresResponse.Items);
      } catch (e) {
        setError('Failed to fetch movies. Please try again later.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);
  const filteredItems = useMemo(() => {
    const selectedGenreName = selectedGenre === 'all' 
      ? null 
      : genres.find(g => g.Id === selectedGenre)?.Name;

    return items
      .filter(item => {
        const matchesSearch = debouncedSearchTerm 
          ? item.Name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) 
          : true;
        
        const matchesGenre = selectedGenreName 
          ? item.Genres?.includes(selectedGenreName) 
          : true;

        return matchesSearch && matchesGenre;
      });
  }, [items, debouncedSearchTerm, selectedGenre, genres]);
  if (loading) return <PageSkeleton />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center p-8">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">An Error Occurred</h1>
        <p className="text-lg text-gray-400">{error}</p>
      </div>
    );
  }
  return (
    <div ref={pageRef} className="p-6 md:p-8">
      <h1 className="text-5xl font-bold mb-8">Movies</h1>
      <SearchAndFilter
        genres={genres}
        onSearchChange={setSearchTerm}
        onGenreChange={setSelectedGenre}
      />
      <MediaGrid items={filteredItems} />
    </div>
  );
}