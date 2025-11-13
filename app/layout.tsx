
export const metadata = {
  title: "美容ブログ自動生成",
  description: "ホットペッパービューティー用の美容特化ブログを自動生成"
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
