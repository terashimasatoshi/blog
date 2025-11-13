// app/api/generate/route.ts

import { NextRequest, NextResponse } from "next/server";

// 👇 ここを相対パスに変更しました
import { searchYouTube } from "../../../lib/fetchers/youtube";
import { searchX } from "../../../lib/fetchers/x";
import { searchInstagramByHashtag } from "../../../lib/fetchers/instagram";
import { listTikTokVideos } from "../../../lib/fetchers/tiktok";
import { generatePost } from "../../../lib/llm";
import { sanitizeForHPB } from "../../../lib/sanitize";
import { SEASON_QUERIES } from "../../../lib/season";

export async function POST(req: NextRequest) {
  try {
    const { theme, freeword, season } = await req.json();

    // 季節のヒントを付与
    const seasonHints = season ? (SEASON_QUERIES[season] || []) : [];
    const q = (freeword && String(freeword).trim()) || theme || "艶髪 ケア 美容室";
    const merged = [q, ...seasonHints].join(" ").trim();

    // SNS から並列収集
    const [yt, xx, ig, tt] = await Promise.all([
      searchYouTube(merged),
      searchX(merged),
      searchInstagramByHashtag(q.replace(/\s+/g, "")), // ハッシュタグっぽく
      listTikTokVideos()
    ]);

    // LLM に渡すための要約用コンテキストを作成
    const contexts = [...yt, ...xx, ...ig, ...tt]
      .filter((x: any) => x?.description || x?.title)
      .slice(0, 16)
      .map((x: any) => (x.title ? x.title : x.description))
      .map((s: string) => s.replace(/\s+/g, " ").trim())
      .map((s: string) => (s.length > 120 ? s.slice(0, 120) + "…" : s));

    // 記事生成 → ホットペッパー用にサニタイズ
    const raw = await generatePost(contexts, theme || q);
    const safe = sanitizeForHPB(raw);

    return NextResponse.json({ ok: true, body: safe });
  } catch (e: any) {
    console.error("generate error:", e);
    return NextResponse.json(
      { ok: false, message: "生成に失敗しました" },
      { status: 500 }
    );
  }
}
