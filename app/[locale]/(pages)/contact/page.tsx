import ContactForm from "@/components/contact/contact-form";
import ContactHeading from "@/components/contact/contact-heading";
import CtaSection from "@/components/ui/cta-section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.metadata" });

  const enUrl = `${SITE_URL}/contact`;
  const arUrl = `${SITE_URL}/ar/contact`;
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

const ContactPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="contact-page flex flex-col gap-(--sections-gap) pt-(--page-pt)">
      <div className="grid-12 px-(--container-px)">
        <div className="col-span-12 flex flex-col gap-[8rem] sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4">
          <ContactHeading />
          <ContactForm />
        </div>
      </div>
      <CtaSection />
    </main>
  );
};

export default ContactPage;
