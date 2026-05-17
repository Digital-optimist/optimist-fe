"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    const value =
      metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);

    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  });

  return null;
}
