import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { useTvNavigation } from '@/hooks/use-tv-navigation';
import { useSettingsStore } from '@/store/settings';
import { jellyfinApi } from '@/lib/jellyfin-api';
import { MediaItemDetails, MediaItem, Season } from '@/lib/types';
const DetailPageSkeleton = () => (
  <div className="min-h-screen bg-gray-900 text-white">
    <div className="relative h-[50vh] md:h-[70vh] w-full">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="relative -mt-32 md:-mt-48 z-10 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="md:flex md:space-x-8">
        <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
          <Skeleton className="w-full aspect-[2/3] rounded-lg" />
        </div>
        <div className="mt-6 md:mt-0 space-y-4 flex-1">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <div className="pt-4">
            <Skeleton className="h-16 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  useTvNavigation(pageRef);
  const { userId } = useSettingsStore();
  const [item, setItem] = useState<MediaItemDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchEpisodesForSeason = useCallback(async (seasonId: string) => {
    if (!id) return;
    setEpisodesLoading(true);
    try {
      const episodesData = await jellyfinApi.getEpisodes(id, seasonId);
      setEpisodes(episodesData.Items);
    } catch (e) {
      console.error('Failed to fetch episodes', e);
      setError('Failed to load episodes for this season.');
    } finally {
      setEpisodesLoading(false);
    }
  }, [id]);
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id || !userId) {
        setError('User not authenticated or item ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const itemData = await jellyfinApi.get<MediaItemDetails>(`/Users/${userId}/Items/${id}`);
        setItem(itemData);
        if (itemData.Type === 'Series') {
          const seasonsData = await jellyfinApi.getSeasons(id);
          setSeasons(seasonsData.Items);
          if (seasonsData.Items.length > 0) {
            // Fetch episodes for the first season initially
            fetchEpisodesForSeason(seasonsData.Items[0].Id);
          }
        }
      } catch (e) {
        setError('Failed to fetch item details.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id, userId, fetchEpisodesForSeason]);
  if (loading) {
    return <DetailPageSkeleton />;
  }
  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white text-center p-8">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Could Not Load Item</h1>
        <p className="text-lg text-gray-400 mb-6">{error || 'The requested media could not be found.'}</p>
        <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 tv-focusable">
          Go Home
        </Button>
      </div>
    );
  }
  return (
    <div ref={pageRef} className="min-h-screen bg-gray-900 text-white">
      <div
        className="relative h-[50vh] md:h-[70vh] w-full"
        style={{
          backgroundImage: `url(${jellyfinApi.getImageUrl(item, 'Backdrop')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="absolute top-6 left-6 z-20 bg-black/50 hover:bg-white/20 h-12 w-12 rounded-full tv-focusable">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="relative -mt-32 md:-mt-48 z-10 p-6 md:p-8 max-w-7xl mx-auto">
        <div className="md:flex md:space-x-8">
          <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
            <img src={jellyfinApi.getImageUrl(item)} alt={item.Name} className="rounded-lg shadow-2xl w-full" />
          </div>
          <div className="mt-6 md:mt-0 space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold">{item.Name}</h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-400">
              <span>{item.ProductionYear}</span>
              {item.OfficialRating && <Badge variant="outline">{item.OfficialRating}</Badge>}
              <span>{item.Type}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {item.Genres?.map((genre) => (
                <Badge key={genre} className="bg-gray-700 text-gray-200">{genre}</Badge>
              ))}
            </div>
            <p className="text-lg text-gray-300 max-w-3xl">{item.Overview}</p>
            <div className="pt-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-6 rounded-full tv-focusable">
                <Link to={`/play/${item.Id}`}>
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Play
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {item.Type === 'Series' && seasons.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Seasons</h2>
            <Tabs defaultValue={seasons[0].Id} onValueChange={fetchEpisodesForSeason} className="w-full">
              <TabsList className="bg-gray-800 p-2 rounded-lg mb-6">
                {seasons.map((season) => (
                  <TabsTrigger key={season.Id} value={season.Id} className="px-4 py-2 text-lg tv-focusable data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
                    {season.Name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {seasons.map((season) => (
                <TabsContent key={season.Id} value={season.Id}>
                  {episodesLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {episodes.map((episode) => (
                        <Link key={episode.Id} to={`/play/${episode.Id}`} className="block group rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-300 tv-focusable">
                          <img src={jellyfinApi.getImageUrl(episode, 'Primary')} alt={episode.Name} className="w-full aspect-video object-cover" />
                          <div className="p-4 space-y-2">
                            <h3 className="text-lg font-semibold truncate">{episode.IndexNumber ? `E${episode.IndexNumber} - ` : ''}{episode.Name}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2">{episode.Overview}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}