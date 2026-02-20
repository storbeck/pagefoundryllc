"use client";

import { useEffect, useRef } from "react";
import { mountKineticGrid } from "@/lib/kinetic-grid";

export default function KineticBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const getThemeOptions = (isDark: boolean) =>
      isDark
        ? {
            backgroundColor: "#050a13",
            baseColor: "#345276",
            glowColor: "#7db3e7",
            baseOpacity: 0.1,
            glowOpacity: prefersReducedMotion ? 0.24 : 0.4,
            spotlightOpacity: prefersReducedMotion ? 0.12 : 0.24,
          }
        : {
            backgroundColor: "#f8fbff",
            baseColor: "#8aa3bf",
            glowColor: "#5f8fbd",
            baseOpacity: 0.14,
            glowOpacity: prefersReducedMotion ? 0.16 : 0.24,
            spotlightOpacity: prefersReducedMotion ? 0.08 : 0.14,
          };

    const handle = mountKineticGrid(container, {
      spacing: prefersReducedMotion ? 58 : 46,
      lineWidth: 1.05,
      attractionStrength: prefersReducedMotion ? 0.12 : 0.22,
      attractionRadius: prefersReducedMotion ? 180 : 230,
      trailStrength: prefersReducedMotion ? 0.4 : 0.9,
      trailDecay: 0.96,
      spotlightRadius: prefersReducedMotion ? 180 : 240,
      ...getThemeOptions(darkQuery.matches),
    });

    const onThemeChange = (event: MediaQueryListEvent) => {
      handle.setOptions(getThemeOptions(event.matches));
    };
    darkQuery.addEventListener("change", onThemeChange);

    return () => {
      darkQuery.removeEventListener("change", onThemeChange);
      handle.destroy();
    };
  }, []);

  return <div ref={containerRef} className="kinetic-bg" aria-hidden="true" />;
}
