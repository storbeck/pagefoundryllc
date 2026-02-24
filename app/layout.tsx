import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Script from "next/script";
import { getCurrentUser } from "@/lib/auth";
import KineticBackground from "@/components/kinetic-background";
import mixpanel from "mixpanel-browser"
import { useEffect } from "react";

const FALLBACK_SITE_URL = "https://pagefoundry.dev";

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  try {
    return new URL(raw);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

const siteUrl = getSiteUrl();

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "PageFoundry LLC | Product and Frontend Engineering",
    template: "%s | PageFoundry LLC",
  },
  description:
    "UI/UX frontend engineering for product teams. I build usable, production-ready interfaces and run focused UX audits to fix confusing flows.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "PageFoundry LLC | Product and Frontend Engineering",
    description:
      "UI/UX frontend engineering for product teams. I build usable, production-ready interfaces and run focused UX audits to fix confusing flows.",
    siteName: "PageFoundry LLC",
    images: [
      {
        url: "/logo.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PageFoundry LLC | Product and Frontend Engineering",
    description:
      "UI/UX frontend engineering for product teams. I build usable, production-ready interfaces and run focused UX audits to fix confusing flows.",
    images: ["/logo.png"],
  },
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

  useEffect(() => {
    // Create an instance of the Mixpanel object, your token is already added to this snippet
    mixpanel.init('4ba463d581f794dcf1a6da2690508d33', {
      autocapture: true,
      record_sessions_percent: 100,
    })
  }, [])

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
        className={`${bodyFont.variable} ${displayFont.variable} ${geistMono.variable} antialiased`}
      >
        <div className="brand-shell min-h-screen font-sans">
          <KineticBackground />
          <main
            className={`brand-card mx-auto flex min-h-screen w-full max-w-5xl flex-col p-4 sm:px-6 md:px-12`}
          >
            <Header />
            <Navigation />
            <div className={`${!isLoggedIn ? "mt-6 md:mt-10" : "mt-4"} w-full`}>
              {children}
            </div>
            <Footer />
          </main>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "PageFoundry LLC",
              url: siteUrl.toString(),
              description:
                "Product and frontend engineering services for SaaS teams.",
              email: "geoff@pagefoundry.dev",
              sameAs: ["https://www.linkedin.com/in/geoff-storbeck-81a25035/"],
              areaServed: "US",
            }),
          }}
        />
      </body>
    </html>
  );
}
