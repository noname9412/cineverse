import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, AlertTriangle } from 'lucide-react';
import { MediaCarousel } from '@/components/MediaCarousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTvNavigation } from '@/hooks/use-tv-navigation';
import { useSettingsStore } from '@/store/settings';
import { jellyfinApi } from '@/lib/jellyfin-api';
import { MediaItem, JellyfinItemsResponse } from '@/lib/types';
const HeroSkeleton = () => (
  <div className="relative h-[60vh] md:h-[80vh] w-full flex items-end p-6 md:p-8">
    <Skeleton className="absolute inset-0" />
    <div className="relative z-10 max-w-2xl space-y-4">
      <Skeleton className="h-16 w-96" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-48 rounded-full" />
        <Skeleton className="h-16 w-40 rounded-full" />
      </div>
    </div>
  </div>
);
const CarouselSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-72 ml-8" />
    <div className="flex space-x-6 px-6 md:px-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-48 md:w-56 lg:w-64">
          <Skeleton className="w-full aspect-[2/3]" />
        </div>
      ))}
    </div>
  </div>
);
export function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useTvNavigation(pageRef);
  const navigate = useNavigate();
  const { serverUrl, apiKey, userId } = useSettingsStore();
  const [heroItem, setHeroItem] = useState<MediaItem | null>(null);
  const [continueWatching, setContinueWatching] = useState<MediaItem[]>([]);
  const [recentlyAddedMovies, setRecentlyAddedMovies] = useState<MediaItem[]>([]);
  const [recentlyAddedShows, setRecentlyAddedShows] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!serverUrl || !apiKey) {
        navigate('/settings');
        return;
      }
      if (!userId) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [resumeRes, moviesRes, showsRes] = await Promise.all([
          jellyfinApi.get<JellyfinItemsResponse<MediaItem>>(`/Users/${userId}/Items/Resume?Limit=10&Recursive=true&Fields=PrimaryImageAspectRatio,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Thumb`),
          jellyfinApi.get<JellyfinItemsResponse<MediaItem>>(`/Users/${userId}/Items?SortBy=DateCreated&SortOrder=Descending&IncludeItemTypes=Movie&Recursive=true&Limit=10&Fields=PrimaryImageAspectRatio,BasicSyncInfo`),
          jellyfinApi.get<JellyfinItemsResponse<MediaItem>>(`/Users/${userId}/Items?SortBy=DateCreated&SortOrder=Descending&IncludeItemTypes=Series&Recursive=true&Limit=10&Fields=PrimaryImageAspectRatio,BasicSyncInfo`),
        ]);
        setContinueWatching(resumeRes.Items);
        setRecentlyAddedMovies(moviesRes.Items);
        setRecentlyAddedShows(showsRes.Items);
        setHeroItem(moviesRes.Items[0] || showsRes.Items[0] || null);
      } catch (e) {
        setError('Failed to fetch data from Jellyfin. Check your settings and connection.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serverUrl, apiKey, userId, navigate]);
  if (loading) {
    return (
      <div ref={pageRef} className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
        <HeroSkeleton />
        <div className="py-16 space-y-16">
          <CarouselSkeleton />
          <CarouselSkeleton />
          <CarouselSkeleton />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white text-center p-8">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">An Error Occurred</h1>
        <p className="text-lg text-gray-400 mb-6">{error}</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 tv-focusable">
          <Link to="/settings">Go to Settings</Link>
        </Button>
      </div>
    );
  }
  return (
    <div ref={pageRef} className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {heroItem ? (
        <div
          className="relative h-[60vh] md:h-[80vh] w-full flex items-end p-6 md:p-8"
          style={{
            backgroundImage: `url(${jellyfinApi.getImageUrl(heroItem, 'Backdrop')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          <motion.div
            className="relative z-10 max-w-2xl space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold">{heroItem.Name}</h1>
            <p className="text-lg text-gray-300 max-w-prose line-clamp-3">{heroItem.Overview}</p>
            <div className="flex items-center space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-6 rounded-full tv-focusable">
                <Link to={`/play/${heroItem.Id}`}>
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Play Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white bg-black/30 hover:bg-white hover:text-black font-bold text-lg px-8 py-6 rounded-full tv-focusable">
                <Link to={`/item/${heroItem.Id}`}>
                  More Info
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="h-[60vh] md:h-[80vh] flex items-center justify-center">
            <p className="text-2xl text-gray-500">No featured content available.</p>
        </div>
      )}
      <div className="py-16 space-y-16">
        {continueWatching.length > 0 && <MediaCarousel title="Continue Watching" items={continueWatching} getImageUrl={jellyfinApi.getImageUrl} />}
        {recentlyAddedMovies.length > 0 && <MediaCarousel title="Recently Added Movies" items={recentlyAddedMovies} getImageUrl={jellyfinApi.getImageUrl} />}
        {recentlyAddedShows.length > 0 && <MediaCarousel title="Recently Added TV Shows" items={recentlyAddedShows} getImageUrl={jellyfinApi.getImageUrl} />}
      </div>
    </div>
  );
}