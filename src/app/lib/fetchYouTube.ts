export async function fetchYouTubeVideos(query: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey.includes('YOUR_KEY')) {
    throw new Error('❌ API KEY is missing or invalid in .env.local');
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`❌ Failed to fetch YouTube videos: ${res.statusText}`);
  }

  const data = await res.json();

  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    channel: item.snippet.channelTitle,
    date: item.snippet.publishedAt,
  }));
}
