import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "../../shared/lib/analytics";

export const AnalyticsPageViews = () => {
  const location = useLocation();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    if (path === lastTrackedPath.current) return;

    lastTrackedPath.current = path;
    trackPageView(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
};
