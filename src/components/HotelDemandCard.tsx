import type { HotelMarketData } from "../types/marketIntel";

export function HotelDemandCard({
  hotelMarket,
}: {
  hotelMarket?: HotelMarketData;
}) {
  const badgeColor =
    hotelMarket?.demand_level === "High Demand"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
      : hotelMarket?.demand_level === "Moderate Demand"
        ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
        : hotelMarket?.demand_level === "Low Demand"
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          : "bg-slate-700/40 text-slate-300 border-slate-600/50";

  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Promenade Hotel Demand
        </h2>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${badgeColor}`}
        >
          {hotelMarket?.demand_level ?? "Unavailable"}
        </span>
      </div>

      <div className="my-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white">
            {hotelMarket?.avg_rate_gbp !== null &&
            hotelMarket?.avg_rate_gbp !== undefined
              ? `£${hotelMarket.avg_rate_gbp}`
              : "N/A"}
          </span>
          <span className="text-lg text-slate-400">/ night avg</span>
        </div>
        {hotelMarket?.target_window && (
          <p className="text-xs text-sky-400 mt-1">
            Window: {hotelMarket.target_window} ({hotelMarket.check_in_date})
          </p>
        )}
      </div>

      <div className="text-sm text-slate-400 space-y-1">
        <p>
          <span className="text-slate-200 font-medium">
            {hotelMarket?.available_properties ?? 0} available
          </span>{" "}
          •{" "}
          <span className="text-slate-200 font-medium">
            {hotelMarket?.sold_out_properties ?? 0} sold out
          </span>{" "}
          (Google Hotels)
        </p>
        {hotelMarket && hotelMarket.carlton_status !== "Not Listed" && (
          <p className="text-xs text-slate-300">
            Carlton Status:{" "}
            <span className="font-medium text-white">
              {hotelMarket.carlton_status}
              {hotelMarket.carlton_rate_gbp
                ? ` (£${hotelMarket.carlton_rate_gbp})`
                : ""}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
