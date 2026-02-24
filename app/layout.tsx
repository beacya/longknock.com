import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Long Knock · 叩寂 — Knocking on the Silent Past",
  description:
    "An immersive historical map charting the exile of Su Shi (Su Dongpo) across Song Dynasty China. Long Knock renders history as flowing light on a dark map — time as a river, lives as passing meteors.",
  keywords: [
    "Long Knock",
    "叩寂",
    "Su Shi",
    "苏东坡",
    "historical map",
    "Song Dynasty",
    "HGIS",
  ],
  authors: [{ name: "Long Knock" }],
  openGraph: {
    title: "Long Knock · 叩寂",
    description: "Knocking on the Silent Past — The Exile of Su Dongpo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
