"use client";

import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

const FALLBACK_TOKEN = "4ba463d581f794dcf1a6da2690508d33";

declare global {
  interface Window {
    __mixpanelInitialized?: boolean;
  }
}

export default function MixpanelProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__mixpanelInitialized) {
      return;
    }

    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || FALLBACK_TOKEN;
    if (!token) {
      return;
    }

    mixpanel.init(token, {
      autocapture: true,
      track_pageview: "full-url",
      record_sessions_percent: 100,
      record_heatmap_data: true,
    });

    window.__mixpanelInitialized = true;
  }, []);

  return null;
}
