import type { MarketIntelData } from "../types/marketIntel";

export function TrafficCard({
  traffic,
}: {
  traffic: MarketIntelData["traffic"];
}) {
  const badgeColor =
    traffic.m55_inbound_status === "Heavy Congestion"
      ? "bg-red-500/20 text-red-300 border-red-500/40"
      : traffic.m55_inbound_status === "Moderate Delays"
        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          M55 Inbound Traffic
        </h2>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${badgeColor}`}
        >
          {traffic.m55_inbound_status}
        </span>
      </div>
      <div className="my-4">
        <span className="text-5xl font-bold text-white">
          {traffic.delay_minutes}
        </span>
        <span className="text-lg text-slate-400 ml-2">min delay</span>
      </div>
      <p className="text-sm text-slate-400">
        Source: Live TomTom Flow Segment (M55 Corridor)
      </p>
    </section>
  );
}
