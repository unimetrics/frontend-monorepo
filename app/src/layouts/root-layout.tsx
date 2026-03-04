import { Outlet } from "react-router-dom";

import { AnalyticsPageViews } from "../components/analytics-pageviews";

export const RootLayout = () => {
  return (
    <>
      <AnalyticsPageViews />
      <Outlet />
    </>
  );
};
