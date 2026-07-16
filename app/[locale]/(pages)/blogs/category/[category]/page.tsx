import { notFound } from "next/navigation";
import BlogCollection from "@/components/blogs/blog-collection";
import BubbleButton from "@/components/ui/bubble-button";
import CtaSection from "@/components/ui/cta-section";
import PageHeading from "@/components/ui/page-heading";
import { getAllCategorySlugs, getCategoryBySlug, getPostsByCategory } from "@/content/blogs";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return getAllCategorySlugs().map(category => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  const t = await getTranslations({ locale, namespace: "blogs.collection" });

  const path = `/blogs/category/${categorySlug}`;
  const enUrl = `https://billix.io${path}`;
  const arUrl = `https://billix.io/ar${path}`;
  const url = locale === "ar" ? arUrl : enUrl;

  return {
    title: t("categoryMetaTitle", { category }),
    description: t("categoryMetaDescription", { category }),
    openGraph: {
      title: t("categoryMetaTitle", { category }),
      description: t("categoryMetaDescription", { category }),
      url,
    },
    alternates: {
      canonical: url,
      languages: { en: enUrl, ar: arUrl },
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  setRequestLocale(locale);

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(category);
  const t = await getTranslations({ locale, namespace: "blogs.collection" });

  return (
    <main className="blogs-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <div className="flex flex-col gap-[8rem]">
        <div className="grid-12 px-(--container-px)">
          <div className="col-span-12 flex flex-col items-center gap-[3.2rem] sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
            <PageHeading
              eyebrow={t("categoryEyebrow")}
              title={category}
              description={t("categoryDescription", { category })}
            />
            <BubbleButton isLink href="/blogs" variant="secondary">
              {t("backToAll")}
            </BubbleButton>
          </div>
        </div>
        <BlogCollection posts={posts} />
      </div>
      <CtaSection />
    </main>
  );
}
