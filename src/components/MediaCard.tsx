import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MediaItem } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
interface MediaCardProps {
  item: MediaItem;
  getImageUrl: (item: MediaItem, type?: 'Primary' | 'Backdrop') => string;
}
export function MediaCard({ item, getImageUrl }: MediaCardProps) {
  return (
    <Link to={`/item/${item.Id}`} className="block group rounded-lg focus:outline-none tv-focusable">
      <motion.div
        className="relative overflow-hidden rounded-lg shadow-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <AspectRatio ratio={2 / 3}>
          <img
            src={getImageUrl(item, 'Primary')}
            alt={item.Name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-lg font-bold truncate">{item.Name}</h3>
        </div>
      </motion.div>
    </Link>
  );
}