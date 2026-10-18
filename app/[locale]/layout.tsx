import localFont from "next/font/local";
import { Cairo } from "next/font/google";
import "../globals.css";
import Debug from "@/components/debug/debug";
import CookieConsent from "@/components/ui/cookie-consent";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import HeaderCompact from "@/components/ui/header-compact";
import Noise from "@/components/ui/noise";
import Preloader from "@/components/ui/preloader";
import { SITE_URL } from "@/constants";
import JsonLd from "@/components/seo/json-ld";
import Providers from "@/providers/providers";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

const ivyprestoHeadline = localFont({
  src: "../fonts/IvyprestoHeadline-LightItalic.woff2",
  style: "italic",
  weight: "300",
  display: "swap",
  variable: "--font-ivypresto-headline",
});

const helveticaNowProText = localFont({
  src: [
    {
      path: "../fonts/HelveticaNowProTextRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNowProTextMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNowProTextBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-helvetica-now-pro-text",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-cairo",
});

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  const siteTitle = t("title");
  const siteDescription = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: "%s | Billix",
    },
    description: siteDescription,
    applicationName: "Billix",
    keywords: [
      "AI workspace",
      "AI automation",
      "AI chat",
      "workflow automation",
      "no-code automation",
      "AI integrations",
      "AI assistant",
      "productivity tool",
      "business automation",
      "Billix",
      "AI content creation",
      "natural language automation",
      "500 integrations",
      "Slack integration",
      "Gmail automation",
      "Notion integration",
      "HubSpot automation",
      "Salesforce integration",
    ],
    authors: [{ name: "Billix", url: SITE_URL }],
    creator: "Billix",
    publisher: "Billix",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      url: locale === "ar" ? `${SITE_URL}/ar` : SITE_URL,
      siteName: "Billix",
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: siteTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: ["/og-image.png"],
      creator: "@BillixIo",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: locale === "ar" ? `${SITE_URL}/ar` : SITE_URL,
      languages: {
        en: SITE_URL,
        ar: `${SITE_URL}/ar`,
        "x-default": SITE_URL,
      },
    },
    category: "technology",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      data-scroll-behavior="smooth"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${ivyprestoHeadline.variable} ${helveticaNowProText.variable} ${locale === "ar" ? cairo.variable : ""}`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>
          <Providers>
            <Analytics />
            <Header />
            <HeaderCompact />
            <Noise />
            {children}
            <Preloader />
            <Footer />
            {process.env.NODE_ENV === "development" && <Debug />}
            <CookieConsent />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
