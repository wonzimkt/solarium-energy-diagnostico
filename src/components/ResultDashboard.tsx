import { useState } from 'react'
import type { DiagnosticoResultado } from '../lib/calculations'
import { formatarMoeda, formatarNumero, formatarPayback } from '../lib/calculations'
import type { FormularioDados } from '../types'
import { REGIME_LABEL, REGIAO_LABEL } from '../lib/constants'
import Stat from './Stat'
import { gerarPdfDiagnostico } from '../lib/pdf'

export default function ResultDashboard({
  dados,
  r,
}: {
  dados: FormularioDados
  r: DiagnosticoResultado
}) {
  const [metodologiaAberta, setMetodologiaAberta] = useState(false)

  const mensagemWhatsapp = encodeURIComponent(
    `Olá! Sou da ${dados.empresa}. Fiz o diagnóstico da Solarium Energy e minha economia estimada é de ${formatarMoeda(
      r.economiaMensal,
    )}/mês, com payback de ${formatarPayback(r.paybackAnos, r.paybackAnosResto)}. Quero falar com um especialista.`,
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
          Diagnóstico pronto
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white">
          O diagnóstico solar da {dados.empresa}
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-10">
        <div className="grid sm:grid-cols-2 gap-8 pb-8 border-b border-white/5">
          <Stat
            label="Economia mensal estimada"
            value={`${formatarMoeda(r.economiaMensal)}`}
            sublabel="por mês"
            accent="solar"
          />
          <Stat
            label="Payback estimado"
            value={formatarPayback(r.paybackAnos, r.paybackAnosResto)}
            sublabel="tempo de retorno do investimento"
            accent="cyan"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-6 py-8 border-b border-white/5">
          <Stat
            size="md"
            label="Investimento estimado"
            value={formatarMoeda(r.investimentoEstimado)}
            accent="solar"
          />
          <Stat
            size="md"
            label="Sistema recomendado"
            value={`${formatarNumero(r.kwpInstalavel)} kWp`}
            accent="cyan"
          />
          <Stat
            size="md"
            label="Geração mensal estimada"
            value={`${formatarNumero(r.energiaGeradaMensalKwh, 0)} kWh`}
            accent="cyan"
          />
        </div>

        {r.limitadoPorArea && (
          <div className="mt-6 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-200">
            A área de telhado informada cobre apenas parte do seu consumo — um sistema
            complementar ou geração remota pode ampliar sua economia. Um especialista pode
            detalhar essa opção.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6 py-8 border-b border-white/5">
          <Stat
            size="md"
            label="Economia acumulada em 25 anos"
            value={formatarMoeda(r.economiaAcumulada25Anos)}
            accent="solar"
          />
          <Stat
            size="md"
            label="CO2 evitado por ano"
            value={`${formatarNumero(r.co2EvitadoTonAno, 1)} ton`}
            accent="cyan"
            sublabel="reforçando seu posicionamento ESG"
          />
        </div>

        <div className="py-6">
          <button
            onClick={() => setMetodologiaAberta((v) => !v)}
            className="text-sm font-medium text-slate-300 hover:text-white inline-flex items-center gap-2"
          >
            Como chegamos a esse número {metodologiaAberta ? '▲' : '▼'}
          </button>
          {metodologiaAberta && (
            <ul className="mt-4 space-y-2 text-sm text-slate-400 list-disc list-inside">
              <li>
                Tarifa efetiva calculada a partir da sua própria fatura:{' '}
                <span className="font-mono text-slate-200">
                  R$ {formatarNumero(r.tarifaEfetiva, 3)}/kWh
                </span>
              </li>
              <li>
                Produtividade solar da região {REGIAO_LABEL[dados.regiao]}, com base em pesquisa
                da UFSC sobre 1.250 sistemas reais em SC.
              </li>
              <li>
                Fator de autoconsumo simultâneo de {Math.round(r.fatorAutoconsumo * 100)}% para o
                regime "{REGIME_LABEL[dados.regime]}", considerando a cobrança progressiva do Fio B
                (Lei 14.300/2022).
              </li>
              <li>Custo do sistema baseado em médias de mercado por porte (kWp) — fonte: Greener.</li>
              <li>Fator de emissão de CO2 evitado com base em dados do MCTI/SIN.</li>
            </ul>
          )}
          <p className="text-xs text-slate-500 mt-4">
            Esta é uma estimativa educada baseada em médias de mercado — a proposta final, com
            valor exato, é elaborada por um especialista Solarium Energy após visita técnica.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <a
            href={`https://wa.me/5549999999999?text=${mensagemWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center rounded-lg bg-solar-400 px-6 py-4 font-semibold text-ink-950 hover:bg-solar-300 transition"
          >
            Falar com um especialista
          </a>
          <button
            onClick={() => gerarPdfDiagnostico(dados, r)}
            className="flex-1 rounded-lg border border-white/15 px-6 py-4 font-semibold text-slate-200 hover:bg-white/5 transition"
          >
            Baixar diagnóstico em PDF
          </button>
        </div>
      </div>
    </div>
  )
}
