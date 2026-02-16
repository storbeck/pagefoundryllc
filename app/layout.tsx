import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Script from "next/script";
import { getCurrentUser } from "@/lib/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

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
          <main
            className={`flex min-h-screen mx-auto w-full max-w-5xl flex-col bg-white p-4 sm:px-6 md:px-12 dark:bg-black`}
          >
            <Header />
            <Navigation />
            <div className={`${!isLoggedIn ? "mt-6 md:mt-10" : "mt-4"} w-full`}>
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
