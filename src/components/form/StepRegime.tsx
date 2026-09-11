import { useState } from 'react'
import { REGIME_LABEL, type Regime } from '../../lib/constants'
import FormShell, { PrimaryButton, ErrorText } from './FormShell'

const opcoes: { valor: Regime; desc: string }[] = [
  { valor: 'turno_1', desc: 'Operação concentrada no período diurno.' },
  { valor: 'turno_2', desc: 'Operação estendida, cobrindo boa parte do dia.' },
  { valor: 'turno_3', desc: 'Operação contínua, incluindo noite e fins de semana.' },
]

export default function StepRegime({
  regime,
  onNext,
  onBack,
}: {
  regime: Regime | ''
  onNext: (regime: Regime) => void
  onBack: () => void
}) {
  const [sel, setSel] = useState<Regime | ''>(regime)
  const [erro, setErro] = useState('')

  function continuar() {
    if (!sel) {
      setErro('Selecione o regime de operação para continuar.')
      return
    }
    onNext(sel)
  }

  return (
    <FormShell
      step={2}
      total={3}
      title="Qual o regime de operação da sua planta?"
      subtitle="Indústrias que operam mais horas aproveitam mais a energia solar gerada durante o dia."
      onBack={onBack}
    >
      <div className="space-y-3">
        {opcoes.map((o) => (
          <button
            key={o.valor}
            onClick={() => setSel(o.valor)}
            className={`w-full text-left rounded-lg border px-5 py-4 transition ${
              sel === o.valor
                ? 'border-solar-400 bg-solar-400/10'
                : 'border-white/10 bg-ink-800 hover:border-white/20'
            }`}
          >
            <p className="font-medium text-white">{REGIME_LABEL[o.valor]}</p>
            <p className="text-sm text-slate-400 mt-0.5">{o.desc}</p>
          </button>
        ))}

        {erro && <ErrorText>{erro}</ErrorText>}

        <div className="pt-2">
          <PrimaryButton onClick={continuar}>Continuar</PrimaryButton>
        </div>
      </div>
    </FormShell>
  )
}
