"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

const CODES: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
};

const LocaleSelector = ({ className }: { className?: string }) => {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common.language");
  const [isPending, startTransition] = useTransition();

  const target: Locale = locale === "ar" ? "en" : "ar";

  const switchLocale = () => {
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  };

  return (
    <button
      data-locale={locale}
      onClick={switchLocale}
      disabled={isPending}
      aria-label={t("switchTo", { language: t(target) })}
      className={cn(
        "border-foreground/60 bg-background text-foreground group relative z-0 size-[4rem] cursor-pointer overflow-hidden rounded-full border border-dashed disabled:cursor-wait",
        className,
      )}
    >
      {/* Shown while browsing Arabic — switches back to English */}
      <span className="ease-primary absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[250%] rotate-90 font-sans text-sm font-medium transition-transform duration-700 will-change-transform group-hover:scale-110 group-hover:rotate-12 group-data-[locale=ar]:-translate-y-1/2 group-data-[locale=ar]:rotate-0">
        {CODES.en}
      </span>
      {/* Shown while browsing English — switches to Arabic */}
      <span className="ease-primary absolute top-1/2 left-1/2 -translate-1/2 -translate-y-[250%] rotate-0 font-sans text-sm font-medium transition-transform duration-700 will-change-transform group-hover:scale-110 group-hover:rotate-12 group-data-[locale=ar]:-rotate-90 group-data-[locale=en]:-translate-y-1/2">
        {CODES.ar}
      </span>
    </button>
  );
};

export default LocaleSelector;
