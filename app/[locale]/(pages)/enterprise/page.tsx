import EnterpriseHeroSection from "@/components/enterprise/enterprise-hero-section";
import EnterpriseStatisticsSection from "@/components/enterprise/enterprise-statistics-section";
import EnterpriseValuesSection from "@/components/enterprise/enterprise-values-section";
import CtaSection from "@/components/ui/cta-section";
import FeaturesSection from "@/components/ui/features-section/features-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enterprise.metadata" });

  const enUrl = `${SITE_URL}/enterprise`;
  const arUrl = `${SITE_URL}/ar/enterprise`;
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

const EnterprisePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="enterprise-page flex flex-col gap-(--sections-gap)">
      <div>
        <EnterpriseHeroSection />
        <EnterpriseValuesSection />
      </div>
      <FeaturesSection />
      <EnterpriseStatisticsSection />
      <CtaSection />
    </main>
  );
};

export default EnterprisePage;
