import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./layouts/root-layout";
import { EmptyPage } from "./pages/empty-page";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <EmptyPage />,
      },
    ],
  },
]);
