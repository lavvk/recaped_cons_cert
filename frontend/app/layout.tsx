import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Providers } from "./providers";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "Recaped",
  description:
    "Create events and save material from those events.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Recaped",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0B10",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Providers>
          <div className="min-h-dvh pb-32">
            <TopBar />
            <main className="container-app pt-2">{children}</main>
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
