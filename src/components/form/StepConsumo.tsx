import { useMemo, useState } from 'react'
import FormShell, { FieldLabel, PrimaryButton, ErrorText } from './FormShell'
import { TARIFA_MAX_PLAUSIVEL, TARIFA_MIN_PLAUSIVEL } from '../../lib/constants'

export default function StepConsumo({
  consumoMedioKwh,
  valorMedioConta,
  areaDisponivelM2,
  onNext,
  onBack,
}: {
  consumoMedioKwh: number | null
  valorMedioConta: number | null
  areaDisponivelM2: number | null
  onNext: (consumo: number, valor: number, area: number | null) => void
  onBack: () => void
}) {
  const [consumo, setConsumo] = useState(consumoMedioKwh?.toString() ?? '')
  const [valor, setValor] = useState(valorMedioConta?.toString() ?? '')
  const [naoSeiArea, setNaoSeiArea] = useState(areaDisponivelM2 === null)
  const [area, setArea] = useState(areaDisponivelM2?.toString() ?? '')
  const [erros, setErros] = useState<string[]>([])

  const consumoNum = parseFloat(consumo.replace(',', '.'))
  const valorNum = parseFloat(valor.replace(',', '.'))

  const tarifaEfetiva = useMemo(() => {
    if (!consumoNum || !valorNum || consumoNum <= 0) return null
    return valorNum / consumoNum
  }, [consumoNum, valorNum])

  const tarifaForaDaFaixa =
    tarifaEfetiva !== null &&
    (tarifaEfetiva < TARIFA_MIN_PLAUSIVEL || tarifaEfetiva > TARIFA_MAX_PLAUSIVEL)

  function continuar() {
    const novosErros: string[] = []

    if (!consumo || isNaN(consumoNum) || consumoNum <= 0) {
      novosErros.push('Informe um consumo médio de energia válido (maior que zero).')
    }
    if (!valor || isNaN(valorNum) || valorNum <= 0) {
      novosErros.push('Informe um valor médio de conta válido (maior que zero).')
    }
    if (!naoSeiArea && area && (isNaN(parseFloat(area)) || parseFloat(area) <= 0)) {
      novosErros.push('A área do telhado, se informada, deve ser maior que zero.')
    }

    if (novosErros.length > 0) {
      setErros(novosErros)
      return
    }

    setErros([])
    const areaFinal = naoSeiArea || !area ? null : parseFloat(area.replace(',', '.'))
    onNext(consumoNum, valorNum, areaFinal)
  }

  return (
    <FormShell
      step={4}
      total={4}
      title="Dados de consumo de energia"
      subtitle="Essas informações estão na sua última fatura da CELESC."
      onBack={onBack}
    >
      <div className="space-y-6">
        <div>
          <FieldLabel hint="Campo 'Consumo/Energia Ativa' da sua fatura CELESC — média dos últimos 3 meses.">
            Consumo médio de energia (kWh/mês)
          </FieldLabel>
          <input
            type="text"
            inputMode="decimal"
            value={consumo}
            onChange={(e) => setConsumo(e.target.value)}
            placeholder="Ex.: 18000"
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-solar-400/50"
          />
        </div>

        <div>
          <FieldLabel hint="Valor médio da fatura de energia dos últimos 3 meses.">
            Valor médio da conta de energia (R$/mês)
          </FieldLabel>
          <input
            type="text"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex.: 15000"
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-solar-400/50"
          />
        </div>

        {tarifaForaDaFaixa && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            A tarifa efetiva calculada (R${' '}
            {tarifaEfetiva!.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/kWh) está fora
            da faixa usual para indústrias em SC (R$ {TARIFA_MIN_PLAUSIVEL.toFixed(2)} a R${' '}
            {TARIFA_MAX_PLAUSIVEL.toFixed(2)}/kWh). Confira os valores de consumo e conta digitados.
          </div>
        )}

        <div>
          <FieldLabel hint="Se não souber, deixe marcado 'não sei' — dimensionamos só pelo consumo.">
            Área de telhado/cobertura disponível (m²)
          </FieldLabel>
          <input
            type="text"
            inputMode="decimal"
            disabled={naoSeiArea}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ex.: 2000"
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-solar-400/50 disabled:opacity-40"
          />
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={naoSeiArea}
              onChange={(e) => setNaoSeiArea(e.target.checked)}
              className="rounded border-white/20 bg-ink-800 text-solar-400 focus:ring-solar-400/50"
            />
            Não sei / prefiro não informar
          </label>
        </div>

        {erros.length > 0 && (
          <div>
            {erros.map((e) => (
              <ErrorText key={e}>{e}</ErrorText>
            ))}
          </div>
        )}

        <PrimaryButton onClick={continuar}>Ver meu diagnóstico</PrimaryButton>
      </div>
    </FormShell>
  )
}
