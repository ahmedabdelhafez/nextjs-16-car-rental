import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarPortal - Rent & Buy Cars",
  description: "Find your dream car for rent or purchase.",
};

import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

import { Footer } from "@/components/layout/Footer";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) {
  const { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background antialiased flex flex-col",
        )}
      >
        <Navbar lng={lng} />
        <main className="flex-1">{children}</main>
        <Footer lng={lng} />
      </body>
    </html>
  );
}
