"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

const SALEASSIST_WIDGET_ID = "b64c75ac-d186-4979-a841-1572d8d9614b";

export default function SaleAssistButton() {
  const shouldOpenOnReadyRef = useRef(false);
  const hasHandledColdStartRef = useRef(false);
  const followUpMountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const mountSaleAssistWidget = useCallback(() => {
    (window as any).saleassist?.mountWidget({
      id: SALEASSIST_WIDGET_ID,
    });
  }, []);

  const openWithColdStartAssist = useCallback(() => {
    mountSaleAssistWidget();

    // SaleAssist cold start may need a second mount call before it opens.
    if (!hasHandledColdStartRef.current) {
      hasHandledColdStartRef.current = true;
      if (followUpMountTimerRef.current) {
        clearTimeout(followUpMountTimerRef.current);
      }
      followUpMountTimerRef.current = setTimeout(() => {
        mountSaleAssistWidget();
      }, 700);
    }
  }, [mountSaleAssistWidget]);

  const openWidget = useCallback(() => {
    if ((window as any).saleassist?.mountWidget) {
      shouldOpenOnReadyRef.current = false;
      openWithColdStartAssist();
      return;
    }

    // If the script is still loading, remember this click and open immediately on load.
    shouldOpenOnReadyRef.current = true;
  }, [openWithColdStartAssist]);

  const handleScriptLoad = useCallback(() => {
    if (shouldOpenOnReadyRef.current) {
      shouldOpenOnReadyRef.current = false;
      openWithColdStartAssist();
    }
  }, [openWithColdStartAssist]);

  useEffect(() => {
    return () => {
      if (followUpMountTimerRef.current) {
        clearTimeout(followUpMountTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        id="sa-live-demo-btn"
        onClick={openWidget}
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
          cursor: "pointer",
          fontFamily: "Arial, sans-serif",
          zIndex: 9999,
          width: "55px",
          textAlign: "center",
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
          <img
            src="https://img.icons8.com/ios-filled/18/ffffff/video-call.png"
            alt=""
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

      <Script
        src="https://static.saleassist.ai/widgets/widget.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </>
  );
}
