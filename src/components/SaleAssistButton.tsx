"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SALEASSIST_WIDGET_ID = "b64c75ac-d186-4979-a841-1572d8d9614b";
const SALEASSIST_SCRIPT_SRC = "https://static.saleassist.ai/widgets/widget.js";
const SALEASSIST_SCRIPT_ID = "saleassist-widget-script";

type SaleAssist = {
  mountWidget?: (opts: { id: string }) => void;
};

declare global {
  interface Window {
    saleassist?: SaleAssist;
  }
}

export default function SaleAssistButton() {
  // Click-to-load: the widget script (164 KiB + pulls Google Fonts Inter)
  // does not load until the user actually clicks Live Demo.
  const scriptStateRef = useRef<"idle" | "loading" | "ready">("idle");
  const followUpMountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  const mountWidget = useCallback(() => {
    window.saleassist?.mountWidget?.({ id: SALEASSIST_WIDGET_ID });

    // SaleAssist cold start may need a second mount call before it opens.
    if (followUpMountTimerRef.current) {
      clearTimeout(followUpMountTimerRef.current);
    }
    followUpMountTimerRef.current = setTimeout(() => {
      window.saleassist?.mountWidget?.({ id: SALEASSIST_WIDGET_ID });
    }, 700);
  }, []);

  const loadScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById(SALEASSIST_SCRIPT_ID)) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.id = SALEASSIST_SCRIPT_ID;
      s.async = true;
      s.src = SALEASSIST_SCRIPT_SRC;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("SaleAssist script failed to load"));
      document.body.appendChild(s);
    });
  }, []);

  const openWidget = useCallback(async () => {
    if (scriptStateRef.current === "ready") {
      mountWidget();
      return;
    }
    if (scriptStateRef.current === "loading") {
      return;
    }
    scriptStateRef.current = "loading";
    setBusy(true);
    try {
      await loadScript();
      scriptStateRef.current = "ready";
      mountWidget();
    } catch {
      scriptStateRef.current = "idle";
    } finally {
      setBusy(false);
    }
  }, [loadScript, mountWidget]);

  useEffect(() => {
    return () => {
      if (followUpMountTimerRef.current) {
        clearTimeout(followUpMountTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      id="sa-live-demo-btn"
      role="button"
      tabIndex={0}
      aria-label="Open Live Demo"
      aria-busy={busy}
      onClick={openWidget}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openWidget();
        }
      }}
      style={{
        position: "fixed",
        right: "5px",
        top: "40%",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: busy ? "wait" : "pointer",
        fontFamily: "Arial, sans-serif",
        zIndex: 9999,
        width: "55px",
        textAlign: "center",
        opacity: busy ? 0.7 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "30px",
          height: "30px",
          background: "#f60",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span className="sa-pulse" />
        <span className="sa-pulse sa-pulse--delay" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.icons8.com/ios-filled/18/ffffff/video-call.png"
          alt=""
          width={18}
          height={18}
          style={{
            width: "18px",
            height: "18px",
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#333",
          lineHeight: 1.2,
        }}
      >
        Live
      </span>
      <span
        style={{
          color: "green",
          fontSize: "12px",
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        Demo
      </span>
    </div>
  );
}
