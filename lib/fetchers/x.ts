
export async function searchX(query: string, max = 10) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) return [];
  const endpoint = "https://api.x.com/2/tweets/search/recent";
  const params = new URLSearchParams({
    query,
    "tweet.fields": "created_at,lang,public_metrics",
    max_results: String(Math.min(max, 100))
  });
  const res = await fetch(`${endpoint}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data || []).map((t: any) => ({
    source: "x",
    title: "",
    description: t?.text || "",
    publishedAt: t?.created_at
  }));
}
