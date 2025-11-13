
"use client";
import { useState } from "react";

const DEFAULT_THEMES = [
  "METEO美髪矯正",
  "オーガニックカラー",
  "頭浸浴スパ",
  "白髪ぼかし",
  "デザインハイライト",
  "乾燥対策トリートメント"
];

const SEASONS = ["春","梅雨","夏","秋","冬"] as const;
type Season = typeof SEASONS[number];

export default function Home() {
  const [theme, setTheme] = useState<string>("");
  const [season, setSeason] = useState<Season | "">("");
  const [freeword, setFreeword] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function generate() {
    setLoading(true);
    setError("");
    setBody("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, freeword, season })
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.message || "生成に失敗しました");
      } else {
        setBody(json.body || "");
      }
    } catch (e: any) {
      setError("生成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 880, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>美容ブログ自動生成</h1>

      <section style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600 }}>既定テーマ</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {DEFAULT_THEMES.map((t) => (
            <button key={t}
              onClick={() => setTheme(t)}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, background: theme === t ? "#eef2ff" : "#fff" }}>
              {t}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600 }}>季節</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {SEASONS.map((s) => (
            <button key={s}
              onClick={() => setSeason(s)}
              style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: season === s ? "#e0f2fe" : "#fff" }}>
              {s}
            </button>
          ))}
          <button onClick={() => setSeason("")} style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8 }}>
            クリア
          </button>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600 }}>フリーワード</div>
        <input
          value={freeword}
          onChange={(e) => setFreeword(e.target.value)}
          placeholder="例: 梅雨 くせ毛 対策 前髪"
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
      </section>

      <section style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button onClick={generate} disabled={loading}
          style={{ padding: "10px 16px", background: "#111", color: "#fff", border: "1px solid #111", borderRadius: 8 }}>
          {loading ? "生成中..." : "記事を作成"}
        </button>
        <button onClick={() => { setTheme(""); setSeason(""); setFreeword(""); setBody(""); }}
          style={{ padding: "10px 16px", border: "1px solid #ddd", borderRadius: 8 }}>
          リセット
        </button>
      </section>

      <section style={{ marginTop: 16 }}>
        {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
        <div style={{ fontWeight: 600, marginBottom: 8 }}>プレビュー</div>
        <textarea value={body} readOnly
          style={{ width: "100%", minHeight: 280, padding: 12, border: "1px solid #ddd", borderRadius: 8 }} />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={() => navigator.clipboard.writeText(body)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
            本文をコピー
          </button>
        </div>
      </section>
    </main>
  );
}
