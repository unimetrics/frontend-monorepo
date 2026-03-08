import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = [
  "en",
  "ru",
  "tr",
  "es",
  "fr",
  "id",
  "pt",
  "zh-CN",
  "zh-TW",
] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

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
        es: {
          translation: {
            emptyPageBody: "Esta página está intencionalmente vacía.",
            emptyPageDescription: "La ruta inicial de la aplicación está lista.",
            emptyPageTitle: "Página vacía",
            pageTitle: "Aplicación Unimetrics",
          },
        },
        fr: {
          translation: {
            emptyPageBody: "Cette page est intentionnellement vide.",
            emptyPageDescription: "La route initiale de l'application est prête.",
            emptyPageTitle: "Page vide",
            pageTitle: "Application Unimetrics",
          },
        },
        id: {
          translation: {
            emptyPageBody: "Halaman ini sengaja dikosongkan.",
            emptyPageDescription: "Rute awal aplikasi sudah siap.",
            emptyPageTitle: "Halaman Kosong",
            pageTitle: "Aplikasi Unimetrics",
          },
        },
        pt: {
          translation: {
            emptyPageBody: "Esta página está intencionalmente vazia.",
            emptyPageDescription: "A rota inicial do aplicativo está pronta.",
            emptyPageTitle: "Página vazia",
            pageTitle: "Aplicativo Unimetrics",
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
        tr: {
          translation: {
            emptyPageBody: "Bu sayfa bilinçli olarak boş bırakılmıştır.",
            emptyPageDescription: "Uygulamanın başlangıç rotası hazır.",
            emptyPageTitle: "Boş Sayfa",
            pageTitle: "Unimetrics Uygulaması",
          },
        },
        "zh-CN": {
          translation: {
            emptyPageBody: "此页面有意留空。",
            emptyPageDescription: "应用的初始路由已就绪。",
            emptyPageTitle: "空页面",
            pageTitle: "Unimetrics 应用",
          },
        },
        "zh-TW": {
          translation: {
            emptyPageBody: "此頁面刻意留空。",
            emptyPageDescription: "應用程式的初始路由已就緒。",
            emptyPageTitle: "空白頁面",
            pageTitle: "Unimetrics 應用程式",
          },
        },
      },
      supportedLngs: [...supportedLanguages],
    });
} catch (error) {
  console.error("Failed to initialize i18n", error);
}

export { default } from "i18next";
