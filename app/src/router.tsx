import { createBrowserRouter } from 'react-router-dom';

import { EmptyPage } from './pages/empty-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <EmptyPage />
  }
]);
