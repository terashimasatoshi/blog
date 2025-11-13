
const IG = "https://graph.facebook.com/v20.0";

export async function searchInstagramByHashtag(tag: string, max = 10) {
  const token = process.env.META_IG_ACCESS_TOKEN;
  const user = process.env.IG_USER_ID;
  if (!token || !user) return [];

  const idRes = await fetch(
    `${IG}/ig_hashtag_search?user_id=${user}&q=${encodeURIComponent(tag)}&access_token=${token}`
  );
  if (!idRes.ok) return [];
  const idJson = await idRes.json();
  const tagId = idJson?.data?.[0]?.id;
  if (!tagId) return [];

  const mediaRes = await fetch(
    `${IG}/${tagId}/recent_media?user_id=${user}&fields=caption,permalink,timestamp&limit=${max}&access_token=${token}`
  );
  if (!mediaRes.ok) return [];
  const json = await mediaRes.json();
  return (json.data || []).map((m: any) => ({
    source: "instagram",
    title: "",
    description: m?.caption || "",
    publishedAt: m?.timestamp
  }));
}
