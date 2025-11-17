import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { jellyfinApi } from '@/lib/jellyfin-api';
export function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Error: Media ID is missing.
      </div>
    );
  }
  const videoUrl = jellyfinApi.getStreamUrl(id);
  return (
    <div className="relative w-screen h-screen bg-black">
      <ReactPlayer
        url={videoUrl}
        playing
        controls
        width="100%"
        height="100%"
      />
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        size="icon"
        className="absolute top-6 left-6 z-20 bg-black/50 hover:bg-white/20 h-14 w-14 rounded-full tv-focusable"
        aria-label="Go back"
      >
        <ArrowLeft className="h-7 w-7 text-white" />
      </Button>
    </div>
  );
}