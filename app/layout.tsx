import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryHub - Discover Amazing Stories",
  description: "Read and write stories on StoryHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}