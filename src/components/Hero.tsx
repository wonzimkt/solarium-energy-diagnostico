import Logo from './Logo'

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <header className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-grid-lines bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,black,transparent)]" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="relative max-w-5xl mx-auto px-6 pt-8 pb-24 sm:pt-10 sm:pb-32">
        <Logo />

        <div className="mt-16 sm:mt-20 max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-300 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Diagnóstico gratuito · leva 2 minutos
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-white">
            Sua indústria está pagando a{' '}
            <span className="text-solar-400">conta de luz mais cara</span> do que devia.
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-xl">
            Descubra em 2 minutos quanto sua fábrica pode economizar por mês com energia solar —
            com payback estimado, investimento e economia projetada em 25 anos.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 rounded-lg bg-solar-400 px-7 py-4 font-semibold text-ink-950 shadow-glow transition hover:bg-solar-300"
            >
              Calcular minha economia agora
              <span className="transition group-hover:translate-x-1">→</span>
            </button>
            <p className="text-sm text-slate-500">
              Exclusivo para indústrias · sem compromisso
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="font-mono text-2xl font-bold text-white">15,8%</p>
              <p className="text-xs text-slate-500 mt-1">reajuste na tarifa industrial da CELESC em 2025</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-white">+30%</p>
              <p className="text-xs text-slate-500 mt-1">produtividade solar de SC vs. as melhores regiões da Alemanha</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-mono text-2xl font-bold text-white">25 anos</p>
              <p className="text-xs text-slate-500 mt-1">de vida útil média do sistema fotovoltaico</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
