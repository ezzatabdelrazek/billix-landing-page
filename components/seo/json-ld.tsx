import { SITE_URL } from "@/constants";

// The marketing site lives on billix.xyz (Ezzat 2026-10-18); APP_URL (billix.io) is only for the product links.
const BASE_URL = SITE_URL;

function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Billix",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon-96x96.png`,
    description:
      "Billix unifies AI chat, automation, content creation, and 500+ integrations in one seamless workspace.",
    sameAs: [
      "https://x.com/BillixIo",
      "https://www.linkedin.com/company/billix/",
      "https://www.instagram.com/billix_io",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@billix.io",
      url: `${BASE_URL}/contact`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Billix",
    url: BASE_URL,
    description:
      "AI Workspace for Chat, Automation & Integrations. Give plain-language instructions and let Billix execute real actions instantly.",
    publisher: {
      "@type": "Organization",
      name: "Billix",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Billix",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered workspace that unifies chat, automation, content creation, and 500+ integrations. No setup, no tech skills required.",
    url: BASE_URL,
    offers: {
      "@type": "Offer",
      price: "4",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      url: `${BASE_URL}/pricing`,
    },
    featureList: [
      "AI Chat",
      "Workflow Automation",
      "Content Creation",
      "500+ App Integrations",
      "Natural Language Commands",
      "Setup-Free Automation",
      "Team Collaboration",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function JsonLd() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />
    </>
  );
}

export function FAQPageJsonLd({
  faqs,
}: {
  faqs: { title: string; content: string[] }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.content.join(" "),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
