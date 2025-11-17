import React from 'react';
import { MediaItem } from '@/lib/types';
import { MediaCard } from './MediaCard';
import { jellyfinApi } from '@/lib/jellyfin-api';
interface MediaGridProps {
  items: MediaItem[];
}
export function MediaGrid({ items }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-gray-500">No items found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
      {items.map((item) => (
        <MediaCard key={item.Id} item={item} getImageUrl={jellyfinApi.getImageUrl} />
      ))}
    </div>
  );
}