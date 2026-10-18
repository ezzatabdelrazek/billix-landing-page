import { notFound } from "next/navigation";
import BlogCollection from "@/components/blogs/blog-collection";
import BubbleButton from "@/components/ui/bubble-button";
import CtaSection from "@/components/ui/cta-section";
import PageHeading from "@/components/ui/page-heading";
import { getAllTagSlugs, getPostsByTag, getTagBySlug } from "@/content/blogs";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export function generateStaticParams() {
  return getAllTagSlugs().map(tag => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag: tagSlug } = await params;
  const tag = getTagBySlug(tagSlug);
  if (!tag) return {};

  const t = await getTranslations({ locale, namespace: "blogs.collection" });

  const path = `/blogs/tag/${tagSlug}`;
  const enUrl = `${SITE_URL}${path}`;
  const arUrl = `${SITE_URL}/ar${path}`;
  const url = locale === "ar" ? arUrl : enUrl;

  return {
    title: t("tagMetaTitle", { tag }),
    description: t("tagMetaDescription", { tag }),
    openGraph: {
      title: t("tagMetaTitle", { tag }),
      description: t("tagMetaDescription", { tag }),
      url,
    },
    alternates: {
      canonical: url,
      languages: { en: enUrl, ar: arUrl },
    },
  };
}

export default async function BlogTagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag: tagSlug } = await params;
  setRequestLocale(locale);

  const tag = getTagBySlug(tagSlug);
  if (!tag) {
    notFound();
  }

  const posts = getPostsByTag(tag);
  const t = await getTranslations({ locale, namespace: "blogs.collection" });

  return (
    <main className="blogs-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <div className="flex flex-col gap-[8rem]">
        <div className="grid-12 px-(--container-px)">
          <div className="col-span-12 flex flex-col items-center gap-[3.2rem] sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
            <PageHeading eyebrow={t("tagEyebrow")} title={tag} description={t("tagDescription", { tag })} />
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
