import type { MatchdayData } from "../types/marketIntel";

export function MatchdayCard({ matchday }: { matchday?: MatchdayData }) {
  const isMatchday = matchday?.is_home_matchday;

  return (
    <section
      className={`rounded-2xl border p-6 flex flex-col justify-between ${
        isMatchday
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
            isMatchday
              ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
              : "bg-slate-800 text-slate-300 border-slate-700"
          }`}
        >
          {isMatchday
            ? "Matchday Today"
            : matchday?.next_fixture
              ? `In ${matchday.next_fixture.days_until}d`
              : "No Match"}
        </span>
      </div>

      <div className="my-4">
        {isMatchday && matchday.today_fixture ? (
          <>
            <div className="text-3xl font-bold text-white">
              vs {matchday.today_fixture.opponent}
            </div>
            <p className="text-xs text-orange-300 mt-1">
              Today • {matchday.today_fixture.kickoff} KO (
              {matchday.today_fixture.competition})
            </p>
          </>
        ) : matchday?.next_fixture ? (
          <>
            <div className="text-3xl font-bold text-white">
              vs {matchday.next_fixture.opponent}
            </div>
            <p className="text-xs text-sky-400 mt-1">
              {matchday.next_fixture.date} • {matchday.next_fixture.kickoff} KO
              ({matchday.next_fixture.competition})
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
  );
}
