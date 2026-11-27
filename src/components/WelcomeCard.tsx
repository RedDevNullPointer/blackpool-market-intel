import { getNextSpecialDay } from "../data/specialDays";

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

export function WelcomeCard() {
  const { greeting, date: ukDateLabel } = getUkGreeting();
  const nextSpecial = getNextSpecialDay();
  const isToday = nextSpecial.daysUntil === 0;

  return (
    <section
      className={`rounded-2xl bg-linear-to-br p-6 flex flex-col justify-between border ${
        isToday
          ? "from-slate-900 to-emerald-950/40 border-emerald-500/40"
          : "from-slate-900 to-sky-950/40 border-sky-800/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400">
          Shift Briefing
        </h2>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${
            isToday
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : "bg-sky-500/15 text-sky-300 border-sky-500/30"
          }`}
        >
          {isToday
            ? `${nextSpecial.name} • Today`
            : nextSpecial.daysUntil === 1
              ? `Tomorrow: ${nextSpecial.name}`
              : `Next: ${nextSpecial.name} (${nextSpecial.daysUntil}d)`}
        </span>
      </div>

      <div className="my-4">
        <div className="text-4xl font-bold text-white">
          {isToday ? `${greeting} — Happy ${nextSpecial.name}!` : greeting}
        </div>
        <p className="text-sm text-sky-300 mt-1">{ukDateLabel}</p>
      </div>

      <p className="text-sm text-slate-300">
        <span className="text-sky-400 font-medium">F&B Hook:</span>{" "}
        {nextSpecial.fbTip}
      </p>
    </section>
  );
}
