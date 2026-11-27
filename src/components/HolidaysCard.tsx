import type { HolidaysData } from "../types/marketIntel";

export function HolidaysCard({ holidays }: { holidays?: HolidaysData }) {
  const isHolidayActive =
    holidays?.is_school_holiday || holidays?.is_bank_holiday_monday;

  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          UK School & Bank Holidays
        </h2>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${
            isHolidayActive
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          }`}
        >
          {holidays?.is_bank_holiday_monday
            ? "Bank Holiday Mon"
            : holidays?.is_school_holiday
              ? "School Holiday"
              : "Term Time"}
        </span>
      </div>

      <div className="my-4">
        <div className="text-3xl font-bold text-white">
          {holidays?.is_school_holiday
            ? holidays.active_school_holiday
            : holidays?.next_school_holiday
              ? `${holidays.next_school_holiday.name} in ${holidays.next_school_holiday.days_until}d`
              : "Term Time"}
        </div>
        <p className="text-xs text-sky-400 mt-1">
          {holidays?.is_school_holiday
            ? `Active: ${holidays.active_nations.join(", ")}`
            : holidays?.next_school_holiday
              ? `Starts ${holidays.next_school_holiday.start} (${holidays.next_school_holiday.nations.join(", ")})`
              : "England, Scotland & Wales"}
        </p>
      </div>

      <p className="text-sm text-slate-400">
        Next Bank Hol Mon:{" "}
        <span className="text-slate-200 font-medium">
          {holidays?.next_bank_holiday_monday
            ? `${holidays.next_bank_holiday_monday.title} (${holidays.next_bank_holiday_monday.date}, ${holidays.next_bank_holiday_monday.region})`
            : "None upcoming"}
        </span>
      </p>
    </section>
  );
}
