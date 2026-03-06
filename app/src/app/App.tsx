import { Helmet } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import { router } from "./providers/router";

export const App = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <meta content="Unimetrics App" name="application-name" />
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
};
