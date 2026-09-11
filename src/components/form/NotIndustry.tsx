export default function NotIndustry({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <h2 className="font-display text-2xl font-semibold text-white">
        Este diagnóstico é exclusivo para indústrias
      </h2>
      <p className="text-slate-400 mt-3">
        Nosso modelo de cálculo foi construído especificamente para o perfil de consumo e operação
        de galpões e plantas industriais — por isso não se aplica bem a comércio, residências,
        agronegócio ou serviços. Se sua empresa for uma indústria, volte quando quiser.
      </p>
      <button
        onClick={onBack}
        className="mt-8 rounded-lg border border-white/10 px-7 py-3.5 font-semibold text-slate-300 hover:bg-white/5 transition"
      >
        Voltar ao início
      </button>
    </div>
  )
}
