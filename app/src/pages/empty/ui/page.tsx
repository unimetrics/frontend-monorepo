import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { ThemeToggle } from "../../../shared/ui/theme-toggle";

export const EmptyPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("emptyPageTitle")}</title>
        <meta name="description" content={t("emptyPageDescription")} />
      </Helmet>

      <main className="min-h-screen bg-white px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">{t("emptyPageTitle")}</h1>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
                onClick={() =>
                  void i18n.changeLanguage(i18n.language === "en" ? "ru" : "en")
                }
              >
                {i18n.language.toUpperCase()}
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
