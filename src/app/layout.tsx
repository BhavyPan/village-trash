import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import 'leaflet/dist/leaflet.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Village Trash Management",
  description: "Clean villages, happy communities - Report trash, volunteer cleaning, earn rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-gray-50">
          <Navigation />
          <main className="flex-1 md:ml-0 overflow-y-auto">
            <div className="md:hidden pt-16">
              {children}
            </div>
            <div className="hidden md:block">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
