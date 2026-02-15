import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PageFoundry LLC",
  description:
    "UI/UX frontend engineering for product teams. I build usable, production-ready interfaces and run focused UX audits to fix confusing flows.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-372318657"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-372318657');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
          <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-white px-4 py-4 sm:px-6 md:px-12 dark:bg-black">
            <Header />
            <Navigation />
            <div className="mt-6 w-full md:mt-10">{children}</div>
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
