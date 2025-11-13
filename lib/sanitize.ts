
// 1000全角以下 / 改行80以下 / 絵文字・記号の除去 / URL除去
// 表示幅カウント: ASCIIと半角カナを0.5、それ以外を1とする近似
function displayWidth(s: string): number {
  let w = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0) || 0;
    const isAscii = cp <= 0x7f;
    const isHalfKana = cp >= 0xff61 && cp <= 0xff9f;
    w += (isAscii || isHalfKana) ? 0.5 : 1;
  }
  return w;
}

// Emoji と 記号 (Unicode property S) を除去
const emojiRe = /\p{Extended_Pictographic}/gu;
const symbolRe = /\p{S}/gu;
// URL除去（http/https）
const urlRe = /\bhttps?:\/\/[^\s]+/gi;

export function sanitizeForHPB(input: string): string {
  let t = input.replace(/\r\n/g, "\n");
  t = t.replace(emojiRe, "");
  t = t.replace(symbolRe, "");
  t = t.replace(urlRe, "");

  // 改行80制限
  const lines = t.split("\n");
  if (lines.length > 80) t = lines.slice(0, 80).join("\n");

  // 1000全角幅に丸める
  let out = "";
  let width = 0;
  for (const ch of t) {
    const w = displayWidth(ch);
    if (width + w > 1000) break;
    out += ch;
    width += w;
  }
  return out.trim();
}
