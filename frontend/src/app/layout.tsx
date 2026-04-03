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
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
