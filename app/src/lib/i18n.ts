import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: {
          pageTitle: 'Unimetrics App',
          emptyPageTitle: 'Empty Page',
          emptyPageDescription: 'Initial app route is ready.',
          emptyPageBody: 'This page is intentionally empty.'
        }
      },
      ru: {
        translation: {
          pageTitle: 'Приложение Unimetrics',
          emptyPageTitle: 'Пустая страница',
          emptyPageDescription: 'Начальный маршрут приложения готов.',
          emptyPageBody: 'Эта страница намеренно пустая.'
        }
      }
    }
  });

export default i18n;
