import * as Sentry from "@sentry/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";

import "./app/styles/index.css";
import { registerSW } from "virtual:pwa-register";

import { App } from "./app/App";
import { initAnalytics } from "./shared/lib/analytics";
import i18n from "./shared/lib/i18n";
import { initSentry } from "./shared/lib/sentry";

initSentry();

registerSW({
  immediate: true,
});

initAnalytics();

createRoot(document.querySelector("#root")!).render(
  <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
    <StrictMode>
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App />
          </ThemeProvider>
        </I18nextProvider>
      </HelmetProvider>
    </StrictMode>
  </Sentry.ErrorBoundary>
);
