'use client';
import React, { useEffect, useState } from 'react';

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  date: string;
};

const AIConcertWidget = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await fetch('/api/youtube?query=live concert 2025 official');
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Failed to load YouTube videos:', error);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Top Concert Videos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="aspect-video w-full">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </a>
            <div className="p-4">
              <p className="font-semibold line-clamp-2">{video.title}</p>
              <p className="text-sm text-gray-600 mt-1">{video.channel}</p>
              <p className="text-sm text-gray-600">
                {new Date(video.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIConcertWidget;
