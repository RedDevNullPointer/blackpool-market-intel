import { useEffect, useState } from "react";

interface EventItem {
  name: string;
  date: string;
  venue: string;
  link: string;
}

interface HotelMarketData {
  target_window: string;
  check_in_date: string;
  avg_rate_gbp: number | null;
  available_properties: number;
  sold_out_properties: number;
  total_checked: number;
  demand_level: string;
  carlton_status: string;
  carlton_rate_gbp: number | null;
}

interface MarketIntelData {
  location: string;
  timestamp: string;
  weather: {
    condition: string;
    temp_celsius: number;
    wind_speed_mph: number;
  };
  rail?: {
  station: string;
  status: string;
  delayed_trains: number;
  cancelled_trains: number;
  total_checked: number;
  next_affected_route: string | null;
};
  traffic: {
    m55_inbound_status: string;
    delay_minutes: number;
  };
  hotel_market?: HotelMarketData;
  events?: EventItem[];
  commercial_recommendation: string;
}


export default function App() {
  const [data, setData] = useState<MarketIntelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntel = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("VITE_API_URL is missing from your .env file.");
      }
      const res = await fetch(apiUrl, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      const json: MarketIntelData = await res.json();
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load market data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, []);

  const trafficBadgeColor =
    data?.traffic.m55_inbound_status === "Heavy Congestion"
      ? "bg-red-500/20 text-red-300 border-red-500/40"
      : data?.traffic.m55_inbound_status === "Moderate Delays"
        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

  const hotelDemandBadgeColor =
    data?.hotel_market?.demand_level === "High Demand"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
      : data?.hotel_market?.demand_level === "Moderate Demand"
        ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
        : data?.hotel_market?.demand_level === "Low Demand"
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          : "bg-slate-700/40 text-slate-300 border-slate-600/50";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-sky-400 font-semibold">
              The Carlton Hotel • F&B Operations
            </p>
            <h1 className="text-3xl font-bold tracking-tight mt-1">
              Blackpool Market Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {data && (
              <span className="text-xs text-slate-400">
                Updated: {new Date(data.timestamp).toLocaleTimeString("en-GB")}
              </span>
            )}
            <button
              onClick={fetchIntel}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-sm font-medium transition cursor-pointer"
            >
              {loading ? "Refreshing..." : "Refresh Live Data"}
            </button>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm">
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-36 lg:col-span-3 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
        )}

        {/* Dashboard Grid */}
        {data && (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weather Card */}
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Live Seafront Weather
                </h2>
                <span className="text-xs text-slate-500">{data.location}</span>
              </div>
              <div className="my-4 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-white">
                  {data.weather.temp_celsius}°C
                </span>
                <span className="text-lg capitalize text-sky-300">
                  {data.weather.condition}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Wind Speed:{" "}
                <span className="text-slate-200 font-medium">
                  {data.weather.wind_speed_mph} mph
                </span>
              </p>
            </section>

            {/* Blackpool North Rail Card */}
<div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
      Blackpool North Rail (BPN)
    </h2>
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        data.rail?.status === "On Time"
          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
          : data.rail?.status === "Minor Delays"
          ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
          : data.rail?.status === "Disrupted"
          ? "bg-rose-950/60 text-rose-400 border-rose-800/60"
          : "bg-slate-800 text-slate-400 border-slate-700"
      }`}
    >
      {data.rail?.status || "Unavailable"}
    </span>
  </div>

  <div>
    <div className="text-4xl font-bold text-white mb-1">
      {data.rail?.status === "On Time"
        ? "Clear"
        : `${(data.rail?.delayed_trains ?? 0) + (data.rail?.cancelled_trains ?? 0)} affected`}
    </div>
    <p className="text-sm text-sky-400 mb-4">
      {data.rail?.next_affected_route
        ? `Affected route: ${data.rail.next_affected_route}`
        : `Inbound arrivals checked: ${data.rail?.total_checked ?? 0}`}
    </p>
  </div>

  <div className="text-sm text-slate-300">
    <span className="font-semibold text-white">
      {data.rail?.delayed_trains ?? 0} delayed • {data.rail?.cancelled_trains ?? 0} cancelled
    </span>{" "}
    <span className="text-slate-400">(Realtime Trains)</span>
  </div>
</div>

            {/* Traffic Card */}
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  M55 Inbound Traffic
                </h2>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${trafficBadgeColor}`}
                >
                  {data.traffic.m55_inbound_status}
                </span>
              </div>
              <div className="my-4">
                <span className="text-5xl font-bold text-white">
                  {data.traffic.delay_minutes}
                </span>
                <span className="text-lg text-slate-400 ml-2">min delay</span>
              </div>
              <p className="text-sm text-slate-400">
                Source: Live TomTom Flow Segment (M55 Corridor)
              </p>
            </section>

            {/* Hotel Demand Card */}
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Promenade Hotel Demand
                </h2>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${hotelDemandBadgeColor}`}
                >
                  {data.hotel_market?.demand_level ?? "Unavailable"}
                </span>
              </div>

              <div className="my-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    {data.hotel_market?.avg_rate_gbp !== null &&
                    data.hotel_market?.avg_rate_gbp !== undefined
                      ? `£${data.hotel_market.avg_rate_gbp}`
                      : "N/A"}
                  </span>
                  <span className="text-lg text-slate-400">/ night avg</span>
                </div>
                {data.hotel_market?.target_window && (
                  <p className="text-xs text-sky-400 mt-1">
                    Window: {data.hotel_market.target_window} (
                    {data.hotel_market.check_in_date})
                  </p>
                )}
              </div>

              <div className="text-sm text-slate-400 space-y-1">
                <p>
                  <span className="text-slate-200 font-medium">
                    {data.hotel_market?.available_properties ?? 0} available
                  </span>{" "}
                  •{" "}
                  <span className="text-slate-200 font-medium">
                    {data.hotel_market?.sold_out_properties ?? 0} sold out
                  </span>{" "}
                  (Google Hotels)
                </p>
                {data.hotel_market &&
                  data.hotel_market.carlton_status !== "Not Listed" && (
                    <p className="text-xs text-slate-300">
                      Carlton Status:{" "}
                      <span className="font-medium text-white">
                        {data.hotel_market.carlton_status}
                        {data.hotel_market.carlton_rate_gbp
                          ? ` (£${data.hotel_market.carlton_rate_gbp})`
                          : ""}
                      </span>
                    </p>
                  )}
              </div>
            </section>

            {/* Commercial Strategy Banner */}
            <section className="lg:col-span-3 rounded-2xl bg-linear-to-br from-slate-900 to-sky-950/40 border border-sky-800/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-3">
                Automated F&B Commercial Strategy
              </h2>
              <p className="text-lg leading-relaxed text-slate-100">
                {data.commercial_recommendation}
              </p>
            </section>

            {/* Upcoming Blackpool Events */}
            <section className="lg:col-span-3 rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Upcoming Blackpool Footfall Drivers
                </h2>
                <span className="text-xs text-slate-500">
                  Live Google Events
                </span>
              </div>

              {data.events && data.events.length > 0 ? (
                <ul className="divide-y divide-slate-800">
                  {data.events.map((ev, index) => (
                    <li
                      key={index}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        {ev.link ? (
                          <a
                            href={ev.link}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-slate-100 hover:text-sky-400 transition"
                          >
                            {ev.name}
                          </a>
                        ) : (
                          <p className="font-medium text-slate-100">
                            {ev.name}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {ev.venue}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full w-fit shrink-0">
                        {ev.date}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  No upcoming events found.
                </p>
              )}
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
