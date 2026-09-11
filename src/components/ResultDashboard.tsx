import { useState } from 'react'
import type { DiagnosticoResultado } from '../lib/calculations'
import {
  formatarMoeda,
  formatarNumero,
  formatarPayback,
  formatarPercentual,
} from '../lib/calculations'
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
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white text-balance">
          Veja quanto a <span className="text-solar-400">{dados.empresa}</span> poderia economizar
          com energia solar
        </h2>
      </div>

      {/* Bloco 1 — o resultado principal, em linguagem simples */}
      <div className="rounded-2xl border border-solar-400/20 bg-gradient-to-b from-solar-400/[0.07] to-transparent p-6 sm:p-10">
        <p className="text-sm text-slate-400 text-center mb-1">Sua economia estimada</p>
        <p className="font-mono font-bold text-5xl sm:text-6xl text-solar-400 text-center tabular-nums">
          {formatarMoeda(r.economiaMensal)}
          <span className="text-2xl text-slate-400">/mês</span>
        </p>
        <p className="text-center text-cyan-300 font-medium mt-2">
          {formatarPercentual(r.percentualEconomia)} a menos na sua conta de energia
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">
              Em quanto tempo o sistema se paga
            </p>
            <p className="font-mono font-bold text-3xl text-cyan-400">
              {formatarPayback(r.paybackAnos, r.paybackAnosResto)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">
              Investimento estimado do sistema
            </p>
            <p className="font-mono font-bold text-3xl text-white">
              {formatarMoeda(r.investimentoEstimado)}
            </p>
          </div>
        </div>
      </div>

      {r.limitadoPorArea && (
        <div className="mt-6 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-200">
          A área de telhado informada cobre apenas parte do seu consumo — um sistema complementar
          ou geração remota pode ampliar sua economia. Um especialista pode detalhar essa opção.
        </div>
      )}

      {/* Bloco 2 — detalhes do sistema recomendado, em segundo plano visual */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8">
        <h3 className="font-display font-semibold text-white mb-1">O sistema recomendado</h3>
        <p className="text-sm text-slate-500 mb-6">
          Dimensionado a partir do seu consumo médio informado.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <Stat
            size="md"
            label="Potência do sistema"
            value={`${formatarNumero(r.kwpInstalavel)} kWp`}
            accent="cyan"
            sublabel="unidade de medida da capacidade de geração"
          />
          <Stat
            size="md"
            label="Geração mensal estimada"
            value={`${formatarNumero(r.energiaGeradaMensalKwh, 0)} kWh`}
            accent="cyan"
            sublabel="energia produzida por mês"
          />
        </div>
      </div>

      {/* Bloco 3 — projeção de longo prazo, com o comparativo de rendimento como "plus" */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8">
        <h3 className="font-display font-semibold text-white mb-1">Projeção em 25 anos</h3>
        <p className="text-sm text-slate-500 mb-6">
          Vida útil média de um sistema fotovoltaico.
        </p>

        <Stat
          label="Economia total acumulada"
          value={formatarMoeda(r.economiaAcumulada25Anos)}
          accent="solar"
          sublabel="somando a economia mensal ao longo de 25 anos"
        />

        <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <p className="text-sm text-cyan-100">
            <strong className="text-cyan-300">Vai além:</strong> se você investisse essa economia
            mensal todo mês a uma taxa de referência do CDI, em 25 anos ela poderia valer{' '}
            <strong className="font-mono text-cyan-300">
              {formatarMoeda(r.economiaInvestidaCDI25Anos)}
            </strong>{' '}
            — um comparativo do potencial desse dinheiro, e não uma promessa de rendimento.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <Stat
            size="md"
            label="CO2 evitado por ano"
            value={`${formatarNumero(r.co2EvitadoTonAno, 1)} toneladas`}
            accent="cyan"
            sublabel="reforçando o posicionamento ESG da sua empresa"
          />
        </div>
      </div>

      {/* Metodologia — dados técnicos escondidos por padrão para não confundir quem não é do ramo */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8">
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
              Produtividade solar da região {REGIAO_LABEL[dados.regiao]}, com base em pesquisa da
              UFSC sobre 1.250 sistemas reais em SC.
            </li>
            <li>
              Fator de autoconsumo simultâneo de {Math.round(r.fatorAutoconsumo * 100)}% para o
              regime "{REGIME_LABEL[dados.regime]}", considerando a cobrança progressiva do Fio B
              (Lei 14.300/2022).
            </li>
            <li>Custo do sistema baseado em médias de mercado por porte (kWp) — fonte: Greener.</li>
            <li>Fator de emissão de CO2 evitado com base em dados do MCTI/SIN.</li>
            <li>
              Comparativo de rendimento calculado com uma taxa de referência do CDI aplicada sobre
              o valor da economia mensal, investida todo mês ao longo de 25 anos.
            </li>
          </ul>
        )}
        <p className="text-xs text-slate-500 mt-4">
          Esta é uma estimativa educada baseada em médias de mercado — a proposta final, com valor
          exato, é elaborada por um especialista Solarium Energy após visita técnica.
        </p>
      </div>

      {/* Financiamento — antes do CTA, para reduzir a objeção de investimento inicial */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8 text-center">
        <p className="text-slate-200">
          Sua economia mensal pode ser suficiente para cobrir a parcela de um{' '}
          <strong className="text-solar-400">financiamento facilitado</strong> — a Solarium Energy
          tem parceria com instituições financeiras credenciadas para financiar seu projeto pela
          linha <strong>BNDES Finame Baixo Carbono</strong>, voltada à geração de energia solar.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
  )
}
