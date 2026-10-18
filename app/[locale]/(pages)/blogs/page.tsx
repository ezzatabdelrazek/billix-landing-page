import BlogCards from "@/components/blogs/blogs-cards";
import BlogsHeading from "@/components/blogs/blogs-heading";
import CtaSection from "@/components/ui/cta-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogs.metadata" });

  const enUrl = `${SITE_URL}/blogs`;
  const arUrl = `${SITE_URL}/ar/blogs`;
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

const BlogsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="blogs-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <div className="flex flex-col gap-[8rem]">
        <div className="grid-12 px-(--container-px)">
          <div className="col-span-12 flex flex-col gap-[8rem] sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
            <BlogsHeading />
          </div>
        </div>
        <BlogCards />
      </div>
      <CtaSection />
    </main>
  );
};

export default BlogsPage;
