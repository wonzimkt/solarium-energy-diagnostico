export default function Qualification({
  onYes,
  onNo,
}: {
  onYes: () => void
  onNo: () => void
}) {
  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
        Sua empresa é uma indústria ou planta produtiva?
      </h2>
      <p className="text-slate-400 mt-3">
        Este diagnóstico foi desenvolvido especificamente para o perfil de consumo industrial
        (galpões, fábricas e plantas produtivas).
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onYes}
          className="rounded-lg bg-solar-400 px-7 py-3.5 font-semibold text-ink-950 hover:bg-solar-300 transition"
        >
          Sim, sou indústria
        </button>
        <button
          onClick={onNo}
          className="rounded-lg border border-white/10 px-7 py-3.5 font-semibold text-slate-300 hover:bg-white/5 transition"
        >
          Não
        </button>
      </div>
    </div>
  )
}
