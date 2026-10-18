import PricingCards from "@/components/pricing/pricing-cards";
import PricingHeading from "@/components/pricing/pricing-heading";
import { FAQPageJsonLd } from "@/components/seo/json-ld";
import FaqsSection from "@/components/ui/faqs-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing.metadata" });

  const enUrl = `${SITE_URL}/pricing`;
  const arUrl = `${SITE_URL}/ar/pricing`;
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

const PricingPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const tFaqs = await getTranslations("common.faqs");
  const faqs = tFaqs.raw("items") as { title: string; content: string[] }[];

  return (
    <main className="pricing-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <FAQPageJsonLd faqs={faqs} />
      <div className="grid-12 gap-y-[8rem] px-(--container-px)">
        <div className="col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
          <PricingHeading />
        </div>
        <div className="col-span-12">
          <PricingCards />
        </div>
      </div>
      <FaqsSection />
    </main>
  );
};

export default PricingPage;
