
const ENDPOINT = "https://www.googleapis.com/youtube/v3/search";

export async function searchYouTube(q: string, max = 5) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  const params = new URLSearchParams({
    key,
    q,
    part: "snippet",
    type: "video",
    order: "date",
    maxResults: String(max)
  });
  const res = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.items || []).map((it: any) => ({
    source: "youtube",
    title: it?.snippet?.title || "",
    description: it?.snippet?.description || "",
    publishedAt: it?.snippet?.publishedAt
  }));
}
