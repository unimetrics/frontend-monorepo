import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

try {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: {
            emptyPageBody: "This page is intentionally empty.",
            emptyPageDescription: "Initial app route is ready.",
            emptyPageTitle: "Empty Page",
            pageTitle: "Unimetrics App",
          },
        },
        ru: {
          translation: {
            emptyPageBody: "Эта страница намеренно пустая.",
            emptyPageDescription: "Начальный маршрут приложения готов.",
            emptyPageTitle: "Пустая страница",
            pageTitle: "Приложение Unimetrics",
          },
        },
      },
      supportedLngs: ["en", "ru"],
    });
} catch (error) {
  console.error("Failed to initialize i18n", error);
}

export { default } from "i18next";
