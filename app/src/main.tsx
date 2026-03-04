import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'next-themes';

import './index.css';
import './lib/i18n';
import i18n from './lib/i18n';
import { App } from './app';

import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </I18nextProvider>
    </HelmetProvider>
  </StrictMode>
);
