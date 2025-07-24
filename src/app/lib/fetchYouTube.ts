export async function fetchYouTubeVideos(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  console.log("🔑 API KEY USED:", apiKey); // Debug

  if (!apiKey || apiKey.includes("YOUR_KEY") || apiKey === "undefined") {
    throw new Error("❌ API KEY is missing or invalid in .env.local");
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${apiKey}`;

  const res = await fetch(endpoint); // <-- make sure this line exists!

  if (!res.ok) {
    throw new Error("❌ Failed to fetch YouTube videos");
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
