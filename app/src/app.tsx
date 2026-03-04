import { Helmet } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";

export const App = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <meta name="application-name" content="Unimetrics App" />
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
};
