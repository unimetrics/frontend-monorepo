import { Outlet } from "react-router-dom";

import { AnalyticsPageViews } from "./analytics-page-views";

export const RootLayout = () => {
  return (
    <>
      <AnalyticsPageViews />
      <Outlet />
    </>
  );
};
