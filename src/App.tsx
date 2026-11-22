import { useEffect, useState } from "react";

interface MarketIntelData {
  location: string;
  timestamp: string;
  weather: {
    condition: string;
    temp_celsius: number;
    wind_speed_mph: number;
  };
  traffic: {
    m55_inbound_status: string;
    delay_minutes: number;
  };
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-sky-400 font-semibold">
              Best Western Carlton Hotel • F&B Operations
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-36 md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
        )}

        {/* Dashboard Grid */}
        {data && (
          <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Traffic Card */}
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  M55 Inbound Traffic
                </h2>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border ${trafficBadgeColor}`}
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

            {/* Commercial Strategy Banner */}
            <section className="md:col-span-2 rounded-2xl bg-linear-to-br from-slate-900 to-sky-950/40 border border-sky-800/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-3">
                Automated F&B Commercial Strategy
              </h2>
              <p className="text-lg leading-relaxed text-slate-100">
                {data.commercial_recommendation}
              </p>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
