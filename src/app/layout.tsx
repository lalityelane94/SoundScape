import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoundScape",
  description: "Real-time collaborative AI music producer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-surface text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}