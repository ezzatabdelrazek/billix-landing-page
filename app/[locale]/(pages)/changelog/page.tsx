import ChangelogEntries from "@/components/changelog/changelog-entries";
import ChangelogHeading from "@/components/changelog/changelog-heading";
import CtaSection from "@/components/ui/cta-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "changelog.metadata" });

  const enUrl = `${SITE_URL}/changelog`;
  const arUrl = `${SITE_URL}/ar/changelog`;
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

const ChangelogPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="changelog-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <div className="flex flex-col gap-[8rem] px-(--container-px)">
        <div className="grid-12">
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
            <ChangelogHeading />
          </div>
        </div>
        <ChangelogEntries />
      </div>
      <CtaSection />
    </main>
  );
};

export default ChangelogPage;
