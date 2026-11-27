import type { LocalDiningOffer } from "../types/marketIntel";

export function DiningOffersCard({ offers }: { offers?: LocalDiningOffer[] }) {
  return (
    <section className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Local Blackpool Dining & Bar Offers
        </h2>
        <span className="text-xs text-slate-500">
          Active Deals • Nearby Pubs & Restaurants
        </span>
      </div>

      {offers && offers.length > 0 ? (
        <ul className="divide-y divide-slate-800">
          {offers.map((offer, idx) => (
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
  );
}
