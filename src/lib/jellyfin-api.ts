import { useSettingsStore } from '@/store/settings';
import { JellyfinUser, MediaItem, MediaItemDetails, JellyfinItemsResponse, Season } from './types';
// Centralized fetch function to communicate with our worker proxy
const fetchFromProxy = async (
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body: Record<string, unknown> = {}
) => {
  const { serverUrl, apiKey, accessToken } = useSettingsStore.getState();
  if (!serverUrl || !apiKey) {
    throw new Error('Jellyfin server not configured.');
  }
  const requestBody: any = {
    path,
    serverUrl,
    apiKey,
    accessToken,
    method,
  };
  if (method === 'POST' && Object.keys(body).length > 0) {
    requestBody.body = body;
  }
  const response = await fetch('/api/jellyfin-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error('Jellyfin API Error:', errorData);
    throw new Error(`Failed to fetch from Jellyfin: ${response.statusText}`);
  }
  // Handle cases where Jellyfin returns no content (e.g., 204 on successful auth)
  if (response.status === 204) {
    return null;
  }
  return response.json();
};
// API client object
export const jellyfinApi = {
  get: <T>(path: string): Promise<T> => fetchFromProxy(path, 'GET'),
  post: <T>(path:string, body: Record<string, unknown>): Promise<T> => fetchFromProxy(path, 'POST', body),
  // --- Authentication ---
  getPublicUsers: (): Promise<JellyfinUser[]> => {
    return fetchFromProxy('/Users/Public');
  },
  authenticate: (username: string, password?: string) => {
    return fetchFromProxy('/Users/AuthenticateByName', 'POST', {
      Username: username,
      Pw: password || '',
    });
  },
  // --- Data Fetching ---
  getGenres: (): Promise<JellyfinItemsResponse<{ Id: string; Name: string }>> => {
    return fetchFromProxy('/Genres');
  },
  getSeasons: (showId: string): Promise<JellyfinItemsResponse<Season>> => {
    const { userId } = useSettingsStore.getState();
    return fetchFromProxy(`/Shows/${showId}/Seasons?userId=${userId}`);
  },
  getEpisodes: (showId: string, seasonId: string): Promise<JellyfinItemsResponse<MediaItem>> => {
    const { userId } = useSettingsStore.getState();
    return fetchFromProxy(`/Shows/${showId}/Episodes?seasonId=${seasonId}&userId=${userId}&Fields=PrimaryImageAspectRatio,BasicSyncInfo,Overview`);
  },
  // --- URL Helpers ---
  getImageUrl: (item: MediaItem | MediaItemDetails, type: 'Primary' | 'Backdrop' = 'Primary', imageTag?: string) => {
    const { serverUrl } = useSettingsStore.getState();
    if (!serverUrl) return '';
    const tag = imageTag || (type === 'Primary' ? item.ImageTags?.Primary : item.BackdropImageTags?.[0]);
    if (!tag) return `https://placehold.co/400x600/111827/3B82F6?text=${encodeURIComponent(item.Name)}`;
    const itemId = item.Id;
    return `${serverUrl}/Items/${itemId}/Images/${type}?tag=${tag}`;
  },
  getUserImageUrl: (userId: string, type: 'Primary' | 'Backdrop' = 'Primary') => {
    const { serverUrl } = useSettingsStore.getState();
    if (!serverUrl) return '';
    // This provides a default avatar-like image. A specific tag could be added if available.
    return `${serverUrl}/Users/${userId}/Images/${type}?width=200&height=200`;
  },
  getStreamUrl: (itemId: string) => {
    const { serverUrl, accessToken } = useSettingsStore.getState();
    if (!serverUrl || !accessToken) return '';
    return `${serverUrl}/Videos/${itemId}/stream?api_key=${accessToken}`;
  },
};