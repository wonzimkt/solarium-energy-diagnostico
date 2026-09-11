import { useState } from 'react'
import { CIDADES_SC, SEGMENTOS_INDUSTRIAIS, type Regiao } from '../../lib/constants'
import FormShell, { FieldLabel, PrimaryButton, ErrorText } from './FormShell'

export default function StepSegmentoCidade({
  segmento,
  cidade,
  onNext,
  onBack,
}: {
  segmento: string
  cidade: string
  onNext: (segmento: string, cidade: string, regiao: Regiao) => void
  onBack: () => void
}) {
  const [seg, setSeg] = useState(segmento)
  const [cid, setCid] = useState(cidade)
  const [erro, setErro] = useState('')

  function continuar() {
    if (!seg || !cid) {
      setErro('Selecione o segmento e a cidade para continuar.')
      return
    }
    const regiao = CIDADES_SC.find((c) => c.nome === cid)?.regiao ?? 'litoral_serra_meio_oeste'
    onNext(seg, cid, regiao)
  }

  return (
    <FormShell
      step={1}
      total={3}
      title="Um pouco sobre sua indústria"
      subtitle="Usamos isso para aplicar a produtividade solar da sua região."
      onBack={onBack}
    >
      <div className="space-y-6">
        <div>
          <FieldLabel>Segmento industrial</FieldLabel>
          <select
            value={seg}
            onChange={(e) => setSeg(e.target.value)}
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
          >
            <option value="">Selecione...</option>
            {SEGMENTOS_INDUSTRIAIS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel hint="Usamos a cidade para aplicar o fator de irradiação solar regional de SC.">
            Cidade / região em Santa Catarina
          </FieldLabel>
          <select
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
          >
            <option value="">Selecione...</option>
            {CIDADES_SC.map((c) => (
              <option key={c.nome} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {erro && <ErrorText>{erro}</ErrorText>}

        <PrimaryButton onClick={continuar}>Continuar</PrimaryButton>
      </div>
    </FormShell>
  )
}
