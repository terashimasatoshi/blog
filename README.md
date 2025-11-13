
# HPB 美容ブログ自動生成アプリ

ホットペッパービューティー用ブログを自動生成（美容特化）。  
GitHub → Vercel でそのままデプロイできます。

## できること
- YouTube / X / Instagram / TikTok から最新情報を収集
- 既定テーマボタン・季節ボタン・フリーワード入力
- LLM が記事を生成
- 全角1000文字/改行80以下/絵文字・記号なしのサニタイズ

## セットアップ
1. このリポジトリを GitHub に push
2. Vercel で Import（Framework: Next.js, Root: `./`）
3. Project Settings → Environment Variables を設定
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (例: `gpt-4o-mini`)
   - `YOUTUBE_API_KEY`
   - `X_BEARER_TOKEN`（任意）
   - `META_IG_ACCESS_TOKEN`, `IG_USER_ID`（任意）
   - `TIKTOK_ACCESS_TOKEN`（任意）
4. Deploy

## ローカル実行
```bash
npm i
cp .env.example .env
npm run dev
# http://localhost:3000
```

## 注意
- 各SNS APIの権限/利用規約を順守してください。
- 本文内に URL/絵文字/記号が入らないように最終サニタイズ済みです。
