export function StrategyBanner({ recommendation }: { recommendation: string }) {
  return (
    <section className="lg:col-span-2 rounded-2xl bg-linear-to-br from-slate-900 to-sky-950/40 border border-sky-800/50 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-3">
        Automated F&B Commercial Strategy
      </h2>
      <p className="text-lg leading-relaxed text-slate-100">{recommendation}</p>
    </section>
  );
}
