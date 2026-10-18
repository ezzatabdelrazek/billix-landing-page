import AboutHeroSection from "@/components/about/about-hero-section";
import AboutMissionSection from "@/components/about/about-mission-section";
import AboutValuesSection from "@/components/about/about-values-section";
import AboutWhyWeExistSection from "@/components/about/about-why-we-exist-section";
import CtaSection from "@/components/ui/cta-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.metadata" });

  const enUrl = `${SITE_URL}/about`;
  const arUrl = `${SITE_URL}/ar/about`;
  const canonical = locale === "ar" ? arUrl : enUrl;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: canonical,
    },
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        ar: arUrl,
      },
    },
  };
}

const AboutPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="about-page flex flex-col gap-(--sections-gap)">
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutWhyWeExistSection />
      <AboutValuesSection />
      <CtaSection />
    </main>
  );
};

export default AboutPage;
