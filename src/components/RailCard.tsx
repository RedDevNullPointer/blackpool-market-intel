import type { MarketIntelData } from "../types/marketIntel";

export function RailCard({ rail }: { rail?: MarketIntelData["rail"] }) {
  const badgeColor =
    rail?.status === "On Time"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      : rail?.status === "Minor Delays"
        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
        : rail?.status === "Disrupted"
          ? "bg-red-500/20 text-red-300 border-red-500/40"
          : "bg-slate-700/40 text-slate-300 border-slate-600/50";

  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Blackpool North Rail (BPN)
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${badgeColor}`}
        >
          {rail?.status || "Unavailable"}
        </span>
      </div>

      <div className="my-4">
        <div className="text-5xl font-bold text-white">
          {rail?.status === "On Time"
            ? "Clear"
            : `${(rail?.delayed_trains ?? 0) + (rail?.cancelled_trains ?? 0)} affected`}
        </div>
        <p className="text-xs text-sky-400 mt-1">
          {rail?.next_affected_route
            ? `Affected route: ${rail.next_affected_route}`
            : `Inbound arrivals checked: ${rail?.total_checked ?? 0}`}
        </p>
      </div>

      <p className="text-sm text-slate-400">
        <span className="text-slate-200 font-medium">
          {rail?.delayed_trains ?? 0} delayed • {rail?.cancelled_trains ?? 0}{" "}
          cancelled
        </span>{" "}
        (Realtime Trains)
      </p>
    </section>
  );
}
