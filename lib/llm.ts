import OpenAI from "openai";

const PATTERNS = [
  "基礎解説（理由→具体例→まとめ）",
  "よくある悩みQ&A形式",
  "失敗例とその対策を中心にした構成",
  "ビフォーアフターをイメージしたストーリー形式",
  "専門家コラム風（原因の掘り下げ＋提案）"
];

export async function generatePost(contextBullets: string[], theme: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY が設定されていません");
  }

  const client = new OpenAI({ apiKey });

  // 毎回違う切り口になるように構成パターンをランダム選択
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

  const sys = `あなたは美容専門の編集者。ホットペッパービューティー用のブログ本文を作成します。

【絶対ルール】
- 全角1000文字以下、改行80回以下
- 絵文字や記号は使わない
- 同じ文章やフレーズを2回以上繰り返さない
- 「当店では」「ぜひお試しください」などの定型文は多用しない（使っても1回まで）
- 段落ごとに切り口を変え、情報が重複しないようにする
- リンクやハッシュタグは本文に含めない
- 読み手は30〜50代の美容意識の高いお客様`;

  const user = `テーマ: ${theme}

今回は「${pattern}」の構成で書いてください。

参考メモ（SNSやYouTubeからの断片情報）:
${contextBullets.map((b) => "・" + b).join("\\n")}

【書き方の指示】
- 1つ目の段落: お客様の悩みや季節要因をわかりやすく描写する
- 2つ目以降の段落: 原因の説明 → 美容師目線の具体的な対策 → サロンでできること、の順で
- 同じ内容を言い換えるだけの文は書かない
- 最後の一文だけ「相談・予約につながる一文」にする`;

  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user }
    ]
  });

  return resp.choices[0]?.message?.content || "";
}
