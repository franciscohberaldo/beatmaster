import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeatMaker",
  description: "Web-based drum sampler — Battery 4 style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-surface text-white antialiased">{children}</body>
    </html>
  );
}
