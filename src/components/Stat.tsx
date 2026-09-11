export default function Stat({
  label,
  value,
  accent = 'solar',
  size = 'lg',
  sublabel,
}: {
  label: string
  value: string
  accent?: 'solar' | 'cyan'
  size?: 'lg' | 'md'
  sublabel?: string
}) {
  const color = accent === 'solar' ? 'text-solar-400' : 'text-cyan-400'
  const sizeClass = size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'

  return (
    <div className="animate-count-up">
      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">{label}</p>
      <p className={`font-mono font-bold tabular-nums ${sizeClass} ${color}`}>{value}</p>
      {sublabel && <p className="text-sm text-slate-500 mt-1">{sublabel}</p>}
    </div>
  )
}
