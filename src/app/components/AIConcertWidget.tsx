// ai-concert-widget.tsx
import React, { useEffect, useState } from 'react';
import { fetchYouTubeVideos } from '../lib/fetchYouTube';

// Define a TypeScript type for the video objects
type Video = {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  date: string;
};
console.log("🧪 TEST ENV:", process.env.NEXT_PUBLIC_YOUTUBE_API_KEY);

const AIConcertWidget = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const results = await fetchYouTubeVideos('live concert 2025 official');
        setVideos(results);
      } catch (error) {
        console.error(error);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">🔥 Top Concert Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="group rounded-lg overflow-hidden shadow border hover:shadow-lg transition"
          >
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:opacity-75 transition duration-300"
              />
            </div>
            <div className="p-4">
              <p className="font-semibold">{video.title}</p>
              <p className="text-sm text-gray-600">{video.channel}</p>
              <p className="text-sm text-gray-600">
                📅 {new Date(video.date).toLocaleDateString()}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                Open in YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIConcertWidget;
