export interface JellyfinUser {
  Name: string;
  Id: string;
  HasPassword?: boolean;
}
export interface JellyfinSessionInfo {
  Id: string;
  UserId: string;
  UserName: string;
}
export interface MediaItem {
  Id: string;
  Name: string;
  Type: 'Movie' | 'Series' | 'Episode';
  ImageTags: {
    Primary?: string;
  };
  BackdropImageTags?: string[];
  Overview: string;
  RunTimeTicks?: number;
  ProductionYear?: number;
  OfficialRating?: string;
  Genres?: string[];
  IndexNumber?: number;
  UserData: {
    PlaybackPositionTicks: number;
    Played: boolean;
  };
}
export interface Season {
  Id: string;
  Name: string;
  IndexNumber: number;
  ImageTags: {
    Primary?: string;
  };
}
export interface MediaItemDetails extends MediaItem {
  Seasons?: Season[];
  Episodes?: MediaItem[];
}
export interface JellyfinItemsResponse<T> {
  Items: T[];
  TotalRecordCount: number;
  StartIndex: number;
}