"use client";

import { useCallback, useState } from "react";
import { openSaleAssist } from "@/lib/saleassist";

export default function SaleAssistButton() {
  // Click-to-load: the widget script (164 KiB + pulls Google Fonts Inter)
  // does not load until the user actually clicks Live Demo.
  const [busy, setBusy] = useState(false);

  const openWidget = useCallback(async () => {
    setBusy(true);
    try {
      await openSaleAssist();
    } finally {
      setBusy(false);
    }
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
