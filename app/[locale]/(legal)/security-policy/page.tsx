import LegalHeading from "@/components/legal/legal-heading";
import SecurityPolicyContent from "@/components/legal/security-policy-content";
import CtaSection from "@/components/ui/cta-section";
import FaqsSection from "@/components/ui/faqs-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.security.metadata" });

  const enUrl = `${SITE_URL}/security-policy`;
  const arUrl = `${SITE_URL}/ar/security-policy`;
  const url = locale === "ar" ? arUrl : enUrl;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url,
    },
    alternates: {
      canonical: url,
      languages: { en: enUrl, ar: arUrl },
    },
  };
}

const SecurityPolicyPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal.security.heading");

  return (
    <main className="security-policy-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <div className="flex flex-col gap-[8rem] px-(--container-px)">
        <div className="grid-12">
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
            <LegalHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
          </div>
        </div>
        <SecurityPolicyContent />
      </div>
      <FaqsSection />
      <CtaSection />
    </main>
  );
};

export default SecurityPolicyPage;
