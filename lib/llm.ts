
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePost(contextBullets: string[], theme: string) {
  const sys = `あなたは美容専門の編集者。ホットペッパービューティー用のブログ本文を作成。
必ず守ること:
- 全角1000文字以下、改行80回以下
- 絵文字や記号を使わない
- 口調は丁寧で簡潔、美容室の専門性を担保
- リンクやハッシュタグは本文に含めない
- 最後は予約や相談に自然につながる一文で締める`;

  const user = `テーマ: ${theme}
参考メモ(箇条書きの断片情報):
${contextBullets.map((b) => "・" + b).join("\n")}
上記を参考に、季節や悩みに寄り添いながら、読みやすく要点をまとめてください。`;

  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user }
    ]
  });
  return resp.choices[0]?.message?.content || "";
}
