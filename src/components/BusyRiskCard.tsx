import type { BusyRiskData } from "../types/marketIntel";

export function BusyRiskCard({ busyRisk }: { busyRisk?: BusyRiskData }) {
  const riskStyles =
    busyRisk?.color === "red"
      ? {
          card: "bg-red-950/30 border-red-700/60",
          badge: "bg-red-500/20 text-red-300 border-red-500/50",
          dot: "bg-red-500",
          text: "text-red-400",
        }
      : busyRisk?.color === "orange"
        ? {
            card: "bg-amber-950/30 border-amber-700/60",
            badge: "bg-amber-500/20 text-amber-300 border-amber-500/50",
            dot: "bg-amber-400",
            text: "text-amber-400",
          }
        : {
            card: "bg-emerald-950/25 border-emerald-700/50",
            badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
            dot: "bg-emerald-400",
            text: "text-emerald-400",
          };

  return (
    <section
      className={`rounded-2xl border p-6 flex flex-col justify-between ${riskStyles.card}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          F&B Busy Risk Level
        </h2>
        <span
          className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${riskStyles.badge}`}
        >
          <span className={`w-2 h-2 rounded-full ${riskStyles.dot}`} />
          {busyRisk?.level ?? "Low"} Risk
        </span>
      </div>

      <div className="my-4">
        <div className={`text-5xl font-bold ${riskStyles.text}`}>
          {busyRisk?.level ?? "Low"}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Composite score: {busyRisk?.score ?? 0} / 10
        </p>
      </div>

      <p className="text-sm text-slate-300">
        {busyRisk?.reasons?.slice(0, 2).join(" • ") ||
          "Standard midweek demand"}
      </p>
    </section>
  );
}
