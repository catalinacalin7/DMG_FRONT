import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AbilityProvider } from "@/components/AbilityProvider";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
// import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

import type { Viewport } from "next";
import { getLocale } from "next-intl/server";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Estimate Master",
  },
  description: "estimatemaster.pro",
  metadataBase: new URL("https://pdr.vecdev.md/"),
  openGraph: {
    title: "Estimate Master",
    url: "https://pdr.vecdev.md/",
    siteName: "ESTIMATE MASTER",
    description: "estimatemaster.pro",
    images: [
      {
        url: "https://pdr.vecdev.md/logo-icon.png",
        width: 32,
        height: 32,
        alt: "EstimateMaster logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "https://pdr.vecdev.md/",
    title: "Estimate Master",
    description: "estimatemaster.pro",
    images: [
      {
        url: "https://pdr.vecdev.md/logo-icon.png",
        width: 32,
        height: 32,
        alt: "EstimateMaster logo",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        {/* <AbilityProvider> */}
        <ReactQueryClientProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ReactQueryClientProvider>
        {/* </AbilityProvider> */}
        {/* </ThemeProvider> */}

        <Toaster />
      </body>
    </html>
  );
}
