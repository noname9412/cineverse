import React from 'react';
import { MediaItem } from '@/lib/types';
import { MediaCard } from './MediaCard';
interface MediaCarouselProps {
  title: string;
  items: MediaItem[];
  getImageUrl: (item: MediaItem, type?: 'Primary' | 'Backdrop') => string;
}
export function MediaCarousel({ title, items, getImageUrl }: MediaCarouselProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-4xl font-bold text-gray-200 px-6 md:px-8">{title}</h2>
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex space-x-6 px-6 md:px-8">
          {items.map((item) => (
            <div key={item.Id} className="flex-shrink-0 w-48 md:w-56 lg:w-64">
              <MediaCard item={item} getImageUrl={getImageUrl} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}