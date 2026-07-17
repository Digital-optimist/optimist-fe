"use client";

import { useCallback, useState } from "react";
import { useGetItNow } from "@/components/home/useGetItNow";
import { useToast } from "@/components/ui/Toast";
import {
  DEFAULT_BASELINE_ISEER,
  DEFAULT_CITY,
  DEFAULT_HOURS,
  TARIFF,
  compute,
  fmt,
  type CalcResult,
  type City,
} from "./logic";
import { CalcForm } from "./CalcForm";
import { ResultsView } from "./ResultsView";
import { LoadingOverlay, type LoadStep } from "./LoadingOverlay";
import { WinnerReveal } from "./WinnerReveal";
import { haptic, sx } from "./helpers";

type View = "form" | "results";

function buildSteps(result: CalcResult, city: City): LoadStep[] {
  return [
    { label: `Located ${city}`, value: `₹${TARIFF.toFixed(0)}/unit` },
    {
      label: `Current AC · ISEER ${result.baselineIseer.toFixed(1)}`,
      value: `${fmt(result.kWhBase1)} kWh/yr`,
    },
    { label: "Optimist · ISEER 6.05", value: `${fmt(result.kWhOpt1)} kWh/yr` },
    { label: "10-yr carbon avoided", value: `${fmt(result.co2Ten)} kg` },
    { label: "Your annual saving", value: `₹${fmt(result.rupeesYr1)}` },
  ];
}

export function CalculatorClient() {
  const { isBuyNowLoading, handleGetItNow } = useGetItNow();
  const { showToast } = useToast();

  // ---- inputs (spec §2 defaults) ----
  const [view, setView] = useState<View>("form");
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [hours, setHours] = useState<number>(DEFAULT_HOURS);
  const [baselineIseer, setBaselineIseer] = useState<number>(DEFAULT_BASELINE_ISEER);

  // ---- results / overlays ----
  const [result, setResult] = useState<CalcResult | null>(null);
  const [resultCity, setResultCity] = useState<City>(DEFAULT_CITY);
  const [resultHours, setResultHours] = useState<number>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Every input has a valid default, so there is nothing to validate.
      setResult(compute({ city, hours, baselineIseer }));
      setResultCity(city);
      setResultHours(hours);
      haptic(20);
      setLoading(true);
    },
    [city, hours, baselineIseer],
  );

  const handleLoadingDone = useCallback(() => {
    setLoading(false);
    setView("results");
    window.scrollTo(0, 0);
    setShowWinner(true);
  }, []);

  const handleWinnerDismiss = useCallback(() => setShowWinner(false), []);

  const goToForm = useCallback(() => {
    setView("form");
    window.scrollTo(0, 0);
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const text = `I could save ₹${fmt(result.rupeesYr1)}/year (₹${fmt(
      result.rupeesTen,
    )} over 10 yrs) by switching to an Optimist AC ❄`;
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Optimist Savings", text, url });
        return;
      } catch {
        /* user cancelled or share failed — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast("Link copied to clipboard", "success");
    } catch {
      showToast(text, "info");
    }
  }, [result, showToast]);

  const handlePdf = useCallback(() => window.print(), []);

  return (
    <div className={sx("page")}>
      <div className={sx("bg")} aria-hidden="true" />

      {view === "form" ? (
        <CalcForm
          city={city}
          hours={hours}
          baselineIseer={baselineIseer}
          onCityChange={setCity}
          onHoursChange={setHours}
          onBaselineChange={setBaselineIseer}
          onSubmit={handleSubmit}
        />
      ) : (
        result && (
          <ResultsView
            result={result}
            state={{ city: resultCity, hours: resultHours, baselineIseer: result.baselineIseer }}
            isBuyLoading={isBuyNowLoading}
            onBack={goToForm}
            onRecalc={goToForm}
            onBuy={handleGetItNow}
            onShare={handleShare}
            onPdf={handlePdf}
          />
        )
      )}

      {loading && result && (
        <LoadingOverlay steps={buildSteps(result, resultCity)} onDone={handleLoadingDone} />
      )}

      {showWinner && result && (
        <WinnerReveal amount={`₹${fmt(result.rupeesYr1)}`} onDismiss={handleWinnerDismiss} />
      )}
    </div>
  );
}
