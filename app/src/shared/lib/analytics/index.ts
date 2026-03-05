const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const isAnalyticsEnabled = import.meta.env.PROD && measurementId.length > 0;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let isInitialized = false;

export const initAnalytics = () => {
  if (!isAnalyticsEnabled || isInitialized) return;

  globalThis.dataLayer = globalThis.dataLayer || [];
  globalThis.gtag =
    globalThis.gtag ||
    function gtag(...args: unknown[]) {
      globalThis.dataLayer.push(args);
    };

  globalThis.gtag("js", new Date());
  globalThis.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);

  isInitialized = true;
};

export const trackPageView = (path: string) => {
  if (!isAnalyticsEnabled || typeof globalThis.gtag !== "function") return;

  globalThis.gtag("event", "page_view", {
    page_location: `${globalThis.location.origin}${path}`,
    page_path: path,
    page_title: document.title,
  });
};
