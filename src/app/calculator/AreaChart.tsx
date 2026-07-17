import { sx } from "./helpers";

interface AreaChartProps {
  value: number;
  max: number;
  variant: "yours" | "optim";
}

// The little electricity-consumption area chart. Pure SVG port of the
// prototype's areaSVG(): the plateau height encodes the value relative to `max`.
export function AreaChart({ value, max, variant }: AreaChartProps) {
  const base = 148;
  const topMin = 18;
  const usable = 118;
  const topY = Math.max(topMin, base - (max ? value / max : 0) * usable);
  const slopeY = Math.min(base - 4, topY + 24);

  const isOptim = variant === "optim";
  const stroke = isOptim ? "#3478F6" : "#9AA4B6";
  const fillTop = isOptim ? "rgba(52,120,246,.34)" : "rgba(154,164,182,.30)";
  const fillBot = isOptim ? "rgba(52,120,246,0)" : "rgba(154,164,182,0)";
  const gradId = `calc-area-${variant}`;

  return (
    <svg
      className={sx("area-svg")}
      viewBox={`0 0 200 ${base + 2}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fillTop} />
          <stop offset="1" stopColor={fillBot} />
        </linearGradient>
      </defs>
      <path
        d={`M16,${base} L16,${topY} L116,${topY} L184,${slopeY} L184,${base} Z`}
        fill={`url(#${gradId})`}
      />
      <path
        d={`M16,${topY} L116,${topY} L184,${slopeY}`}
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          isOptim
            ? { filter: "drop-shadow(0 1px 5px rgba(52,120,246,.55))" }
            : undefined
        }
      />
      <line
        x1="44"
        y1="6"
        x2="44"
        y2={topY}
        stroke={stroke}
        strokeWidth="1.6"
        strokeDasharray="2 4"
        opacity=".75"
      />
      <circle cx="44" cy="6" r="3.4" fill={stroke} />
      <line
        x1="116"
        y1={topY}
        x2="116"
        y2={base}
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity=".3"
      />
      <line
        x1="184"
        y1={slopeY}
        x2="184"
        y2={base}
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity=".3"
      />
    </svg>
  );
}
