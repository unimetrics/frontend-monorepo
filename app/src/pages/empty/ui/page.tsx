import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { type SupportedLanguage, supportedLanguages } from "../../../shared/lib/i18n";
import { ThemeToggle } from "../../../shared/ui/theme-toggle";

const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return supportedLanguages.includes(value as SupportedLanguage);
};

export const EmptyPage = () => {
  const { i18n, t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("emptyPageTitle")}</title>
        <meta content={t("emptyPageDescription")} name="description" />
      </Helmet>

      <main className="min-h-screen bg-white px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">{t("emptyPageTitle")}</h1>

            <div className="flex items-center gap-2">
              <button
                className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
                onClick={async () => {
                  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
                  const normalizedLanguage = isSupportedLanguage(currentLanguage)
                    ? currentLanguage
                    : (supportedLanguages.find(language =>
                        currentLanguage.startsWith(`${language}-`)
                      ) ?? supportedLanguages[0]);
                  const currentIndex = supportedLanguages.indexOf(normalizedLanguage);
                  const nextLanguage =
                    supportedLanguages[(currentIndex + 1) % supportedLanguages.length];
                  await i18n.changeLanguage(nextLanguage);
                }}
                type="button"
              >
                {(i18n.resolvedLanguage ?? i18n.language).toUpperCase()}
              </button>
              <ThemeToggle />
            </div>
          </header>

          <p className="text-slate-600 dark:text-slate-300">{t("emptyPageBody")}</p>
        </div>
      </main>
    </>
  );
};
