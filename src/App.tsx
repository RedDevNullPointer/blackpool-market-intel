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

interface BusyRiskData {
  level: "Low" | "Moderate" | "High";
  color: "green" | "orange" | "red";
  score: number;
  reasons: string[];
}

interface HolidaysData {
  is_school_holiday: boolean;
  active_school_holiday: string | null;
  active_nations: string[];
  next_school_holiday: {
    name: string;
    start: string;
    nations: string[];
    days_until: number;
  } | null;
  is_bank_holiday_monday: boolean;
  bank_holiday_weekend_soon: boolean;
  next_bank_holiday_monday: {
    title: string;
    date: string;
    region: string;
    days_until: number;
  } | null;
}

interface MatchdayData {
  is_home_matchday: boolean;
  today_fixture: {
    date: string;
    kickoff: string;
    opponent: string;
    competition: string;
  } | null;
  next_fixture: {
    date: string;
    kickoff: string;
    opponent: string;
    competition: string;
    days_until: number;
  } | null;
}

interface LocalDiningOffer {
  title: string;
  offer_tag?: string;
  source: string;
  snippet: string;
  link: string;
}

interface MarketIntelData {
  location: string;
  timestamp: string;
  busy_risk?: BusyRiskData;
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
  holidays?: HolidaysData;
  matchday?: MatchdayData;
  local_dining_offers?: LocalDiningOffer[];
  events?: EventItem[];
  commercial_recommendation: string;
}

function getUkGreeting() {
  const now = new Date();
  const ukHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      hour12: false,
    }).format(now),
  );
  const ukDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  if (ukHour < 12) return { greeting: "Good Morning", date: ukDate };
  if (ukHour < 18) return { greeting: "Good Afternoon", date: ukDate };
  return { greeting: "Good Evening", date: ukDate };
}

export default function App() {
  const [data, setData] = useState<MarketIntelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { greeting, date: ukDateLabel } = getUkGreeting();

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

  const riskStyles =
    data?.busy_risk?.color === "red"
      ? {
          card: "bg-red-950/30 border-red-700/60",
          badge: "bg-red-500/20 text-red-300 border-red-500/50",
          dot: "bg-red-500",
          text: "text-red-400",
        }
      : data?.busy_risk?.color === "orange"
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
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-36 lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
        )}

        {/* Dashboard Grid (4x2) */}
        {data && (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* ROW 1 LEFT: Welcome Card */}
            <section className="rounded-2xl bg-linear-to-br from-slate-900 to-sky-950/40 border border-sky-800/40 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400">
                  Shift Briefing
                </h2>
                <span className="text-xs text-slate-400">Blackpool, UK</span>
              </div>

              <div className="my-4">
                <div className="text-4xl font-bold text-white">{greeting}</div>
                <p className="text-sm text-sky-300 mt-1">{ukDateLabel}</p>
              </div>

              <p className="text-sm text-slate-400">
                The Carlton Hotel • Live F&B demand, travel & local footfall
              </p>
            </section>

            {/* ROW 1 RIGHT: Busy Risk Card (Green / Orange / Red) */}
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
                  {data.busy_risk?.level ?? "Low"} Risk
                </span>
              </div>

              <div className="my-4">
                <div className={`text-5xl font-bold ${riskStyles.text}`}>
                  {data.busy_risk?.level ?? "Low"}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Composite score: {data.busy_risk?.score ?? 0} / 10
                </p>
              </div>

              <p className="text-sm text-slate-300">
                {data.busy_risk?.reasons?.slice(0, 2).join(" • ") ||
                  "Standard midweek demand"}
              </p>
            </section>

            {/* ROW 2 LEFT: Weather Card */}
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

            {/* ROW 2 RIGHT: Hotel Demand Card */}
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

            {/* ROW 3 LEFT: M55 Traffic Card */}
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

            {/* ROW 3 RIGHT: Blackpool North Rail Card */}
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Blackpool North Rail (BPN)
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${
                    data.rail?.status === "On Time"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : data.rail?.status === "Minor Delays"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : data.rail?.status === "Disrupted"
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-slate-700/40 text-slate-300 border-slate-600/50"
                  }`}
                >
                  {data.rail?.status || "Unavailable"}
                </span>
              </div>

              <div className="my-4">
                <div className="text-5xl font-bold text-white">
                  {data.rail?.status === "On Time"
                    ? "Clear"
                    : `${(data.rail?.delayed_trains ?? 0) + (data.rail?.cancelled_trains ?? 0)} affected`}
                </div>
                <p className="text-xs text-sky-400 mt-1">
                  {data.rail?.next_affected_route
                    ? `Affected route: ${data.rail.next_affected_route}`
                    : `Inbound arrivals checked: ${data.rail?.total_checked ?? 0}`}
                </p>
              </div>

              <p className="text-sm text-slate-400">
                <span className="text-slate-200 font-medium">
                  {data.rail?.delayed_trains ?? 0} delayed •{" "}
                  {data.rail?.cancelled_trains ?? 0} cancelled
                </span>{" "}
                (Realtime Trains)
              </p>
            </section>

            {/* ROW 4 LEFT: UK School & Bank Holidays Card */}
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  UK School & Bank Holidays
                </h2>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${
                    data.holidays?.is_school_holiday ||
                    data.holidays?.is_bank_holiday_monday
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {data.holidays?.is_bank_holiday_monday
                    ? "Bank Holiday Mon"
                    : data.holidays?.is_school_holiday
                      ? "School Holiday"
                      : "Term Time"}
                </span>
              </div>

              <div className="my-4">
                <div className="text-3xl font-bold text-white">
                  {data.holidays?.is_school_holiday
                    ? data.holidays.active_school_holiday
                    : data.holidays?.next_school_holiday
                      ? `${data.holidays.next_school_holiday.name} in ${data.holidays.next_school_holiday.days_until}d`
                      : "Term Time"}
                </div>
                <p className="text-xs text-sky-400 mt-1">
                  {data.holidays?.is_school_holiday
                    ? `Active: ${data.holidays.active_nations.join(", ")}`
                    : data.holidays?.next_school_holiday
                      ? `Starts ${data.holidays.next_school_holiday.start} (${data.holidays.next_school_holiday.nations.join(", ")})`
                      : "England, Scotland & Wales"}
                </p>
              </div>

              <p className="text-sm text-slate-400">
                Next Bank Hol Mon:{" "}
                <span className="text-slate-200 font-medium">
                  {data.holidays?.next_bank_holiday_monday
                    ? `${data.holidays.next_bank_holiday_monday.title} (${data.holidays.next_bank_holiday_monday.date}, ${data.holidays.next_bank_holiday_monday.region})`
                    : "None upcoming"}
                </span>
              </p>
            </section>

            {/* ROW 4 RIGHT: Blackpool FC Matchday Card */}
            <section
              className={`rounded-2xl border p-6 flex flex-col justify-between ${
                data.matchday?.is_home_matchday
                  ? "bg-orange-950/35 border-orange-600/60"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                  Blackpool FC • Home
                </h2>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${
                    data.matchday?.is_home_matchday
                      ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {data.matchday?.is_home_matchday
                    ? "Matchday Today"
                    : data.matchday?.next_fixture
                      ? `In ${data.matchday.next_fixture.days_until}d`
                      : "No Match"}
                </span>
              </div>

              <div className="my-4">
                {data.matchday?.is_home_matchday &&
                data.matchday.today_fixture ? (
                  <>
                    <div className="text-3xl font-bold text-white">
                      vs {data.matchday.today_fixture.opponent}
                    </div>
                    <p className="text-xs text-orange-300 mt-1">
                      Today • {data.matchday.today_fixture.kickoff} KO (
                      {data.matchday.today_fixture.competition})
                    </p>
                  </>
                ) : data.matchday?.next_fixture ? (
                  <>
                    <div className="text-3xl font-bold text-white">
                      vs {data.matchday.next_fixture.opponent}
                    </div>
                    <p className="text-xs text-sky-400 mt-1">
                      {data.matchday.next_fixture.date} •{" "}
                      {data.matchday.next_fixture.kickoff} KO (
                      {data.matchday.next_fixture.competition})
                    </p>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-slate-300">
                    No upcoming fixtures
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-400">
                Bloomfield Road • Pre/post-match bar & dining spike
              </p>
            </section>

            {/* Commercial Strategy Banner */}
            <section className="lg:col-span-2 rounded-2xl bg-linear-to-br from-slate-900 to-sky-950/40 border border-sky-800/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-3">
                Automated F&B Commercial Strategy
              </h2>
              <p className="text-lg leading-relaxed text-slate-100">
                {data.commercial_recommendation}
              </p>
            </section>

            {/* Local Restaurant & Pub Dining/Bar Offers */}
            <section className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Local Blackpool Dining & Bar Offers
                </h2>
                <span className="text-xs text-slate-500">
                  Active Deals • Nearby Pubs & Restaurants
                </span>
              </div>

              {data.local_dining_offers &&
              data.local_dining_offers.length > 0 ? (
                <ul className="divide-y divide-slate-800">
                  {data.local_dining_offers.map((offer, idx) => (
                    <li key={idx} className="py-3.5 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={offer.link}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-slate-100 hover:text-sky-400 transition"
                          >
                            {offer.title}
                          </a>
                          {offer.offer_tag && (
                            <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/35 px-2.5 py-0.5 rounded-full">
                              {offer.offer_tag}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">
                          {offer.source}
                        </span>
                      </div>
                      {offer.snippet && (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {offer.snippet}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  No active local dining or bar deals found right now.
                </p>
              )}
            </section>

            {/* Upcoming Blackpool Events */}
            <section className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
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
