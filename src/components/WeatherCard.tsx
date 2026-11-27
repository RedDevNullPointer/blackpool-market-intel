import type { MarketIntelData } from "../types/marketIntel";

interface Props {
  location: string;
  weather: MarketIntelData["weather"];
}

export function WeatherCard({ location, weather }: Props) {
  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Live Seafront Weather
        </h2>
        <span className="text-xs text-slate-500">{location}</span>
      </div>
      <div className="my-4 flex items-baseline gap-4">
        <span className="text-5xl font-bold text-white">
          {weather.temp_celsius}°C
        </span>
        <span className="text-lg capitalize text-sky-300">
          {weather.condition}
        </span>
      </div>
      <p className="text-sm text-slate-400">
        Wind Speed:{" "}
        <span className="text-slate-200 font-medium">
          {weather.wind_speed_mph} mph
        </span>
      </p>
    </section>
  );
}
