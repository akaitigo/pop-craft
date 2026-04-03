import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POP-Craft — POP即時生成ツール",
  description: "小売店舗のPOPをテンプレートから即時生成",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&family=Noto+Serif+JP:wght@700&family=Yomogi&family=Shippori+Mincho+B1:wght@800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
