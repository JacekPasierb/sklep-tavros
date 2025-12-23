type Props = {
    label: string;
    value: string;
    hint?: string;
  };
  
  export function StatCard({label, value, hint}: Props) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
        <div className="mt-2 text-2xl font-semibold text-black">{value}</div>
        {hint ? <div className="mt-2 text-sm text-zinc-600">{hint}</div> : null}
      </div>
    );
  }
  