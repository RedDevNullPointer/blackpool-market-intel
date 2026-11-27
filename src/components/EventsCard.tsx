import type { EventItem } from "../types/marketIntel";

export function EventsCard({ events }: { events?: EventItem[] }) {
  return (
    <section className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Upcoming Blackpool Footfall Drivers
        </h2>
        <span className="text-xs text-slate-500">Live Google Events</span>
      </div>

      {events && events.length > 0 ? (
        <ul className="divide-y divide-slate-800">
          {events.map((ev, index) => (
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
                  <p className="font-medium text-slate-100">{ev.name}</p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">{ev.venue}</p>
              </div>
              <span className="text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full w-fit shrink-0">
                {ev.date}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">No upcoming events found.</p>
      )}
    </section>
  );
}
