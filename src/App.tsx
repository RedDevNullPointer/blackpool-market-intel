import { useEffect, useState } from "react";
import type { MarketIntelData } from "./types/marketIntel";
import { WelcomeCard } from "./components/WelcomeCard";
import { BusyRiskCard } from "./components/BusyRiskCard";
import { WeatherCard } from "./components/WeatherCard";
import { HotelDemandCard } from "./components/HotelDemandCard";
import { TrafficCard } from "./components/TrafficCard";
import { RailCard } from "./components/RailCard";
import { HolidaysCard } from "./components/HolidaysCard";
import { MatchdayCard } from "./components/MatchdayCard";
import { StrategyBanner } from "./components/StrategyBanner";
import { DiningOffersCard } from "./components/DiningOffersCard";
import { EventsCard } from "./components/EventsCard";

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-900 border border-slate-800"
              />
            ))}
            <div className="h-36 lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
        )}

        {/* Dashboard Grid (4x2 + Full-Width Feeds) */}
        {data && (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WelcomeCard />
            <BusyRiskCard busyRisk={data.busy_risk} holidays={data.holidays} />
            <WeatherCard location={data.location} weather={data.weather} />
            <HotelDemandCard hotelMarket={data.hotel_market} />
            <TrafficCard traffic={data.traffic} />
            <RailCard rail={data.rail} />
            <HolidaysCard holidays={data.holidays} />
            <MatchdayCard matchday={data.matchday} />
            <StrategyBanner recommendation={data.commercial_recommendation} />
            <DiningOffersCard offers={data.local_dining_offers} />
            <EventsCard events={data.events} />
          </main>
        )}
      </div>
    </div>
  );
}
