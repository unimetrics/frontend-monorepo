import * as Sentry from "@sentry/react";

const dsn = (import.meta.env.VITE_SENTRY_DSN ?? "").trim();
const environment = (
  import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE
).trim();
const release = (import.meta.env.VITE_SENTRY_RELEASE ?? "").trim();
const isSentryEnabled = import.meta.env.PROD && dsn.length > 0;

const toSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;

  const parsedValue = Number.parseFloat(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0 || parsedValue > 1) {
    return fallback;
  }

  return parsedValue;
};

const tracesSampleRate = toSampleRate(
  import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
  0.1
);
const replaysSessionSampleRate = toSampleRate(
  import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  0
);
const replaysOnErrorSampleRate = toSampleRate(
  import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  1
);

let isInitialized = false;

export const initSentry = () => {
  if (!isSentryEnabled || isInitialized) return;

  Sentry.init({
    denyUrls: [/extensions\//i, /^chrome:\/\//i, /^moz-extension:\/\//i],
    dsn,
    enabled: true,
    environment,
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications.",
    ],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        blockAllMedia: true,
        maskAllText: true,
      }),
    ],
    release: release.length > 0 ? release : undefined,
    replaysOnErrorSampleRate,
    replaysSessionSampleRate,
    sendDefaultPii: false,
    tracesSampleRate,
  });

  Sentry.setTag("platform", "web");
  isInitialized = true;
};
