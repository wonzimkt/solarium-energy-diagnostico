export default function Logo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-auto" fill="none">
        <path d="M32 8 L19 34 H30 L25 56 L47 26 H34 Z" fill="#f7a814" />
        <path
          d="M10 46 L21 46 L27 37 L33 50 L39 41 L54 41"
          stroke="#3fd0e6"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display font-semibold tracking-tight text-lg text-white">
        Solarium <span className="text-solar-400">Energy</span>
      </span>
    </div>
  )
}
