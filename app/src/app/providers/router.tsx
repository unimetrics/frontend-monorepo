import { createBrowserRouter } from "react-router-dom";

import { EmptyPage } from "../../pages/empty";
import { RootLayout } from "./root-layout";

export const router = createBrowserRouter([
  {
    children: [
      {
        element: <EmptyPage />,
        path: "/",
      },
    ],
    element: <RootLayout />,
  },
]);
