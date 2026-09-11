import jsPDF from 'jspdf'
import type { DiagnosticoResultado } from './calculations'
import { formatarMoeda, formatarNumero, formatarPayback, formatarPercentual } from './calculations'
import type { FormularioDados } from '../types'
import { REGIME_LABEL } from './constants'

export function gerarPdfDiagnostico(dados: FormularioDados, r: DiagnosticoResultado) {
  const doc = new jsPDF()
  const inkR = 5,
    inkG = 10,
    inkB = 20
  const solarR = 247,
    solarG = 168,
    solarB = 20

  doc.setFillColor(inkR, inkG, inkB)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text('Solarium Energy', 14, 20)
  doc.setFontSize(11)
  doc.setTextColor(solarR, solarG, solarB)
  doc.text('Diagnóstico de Economia com Energia Solar Industrial', 14, 29)

  doc.setTextColor(30, 30, 30)
  let y = 52

  doc.setFontSize(13)
  doc.text(`Empresa: ${dados.empresa}`, 14, y)
  y += 7
  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  doc.text(`Contato: ${dados.whatsapp}`, 14, y)
  y += 6
  doc.text(
    `Segmento: ${dados.segmento} · Cidade: ${dados.cidade} · Regime: ${REGIME_LABEL[dados.regime]}`,
    14,
    y,
  )
  y += 12

  const linha = (label: string, valor: string) => {
    doc.setFontSize(10)
    doc.setTextColor(90, 90, 90)
    doc.text(label, 14, y)
    doc.setFontSize(14)
    doc.setTextColor(20, 20, 20)
    doc.text(valor, 14, y + 7)
    y += 18
  }

  doc.setDrawColor(230, 230, 230)
  doc.line(14, y - 6, 196, y - 6)

  linha(
    'Economia mensal estimada',
    `${formatarMoeda(r.economiaMensal)}/mês (${formatarPercentual(r.percentualEconomia)} da conta atual)`,
  )
  linha('Payback estimado', formatarPayback(r.paybackAnos, r.paybackAnosResto))
  linha('Investimento estimado do sistema', formatarMoeda(r.investimentoEstimado))
  linha(
    'Potência recomendada / Geração mensal',
    `${formatarNumero(r.kwpInstalavel)} kWp · ${formatarNumero(r.energiaGeradaMensalKwh, 0)} kWh/mês`,
  )
  linha('Economia acumulada em 25 anos', formatarMoeda(r.economiaAcumulada25Anos))
  linha(
    'Se investida a uma taxa de referência do CDI em 25 anos',
    formatarMoeda(r.economiaInvestidaCDI25Anos),
  )
  linha('CO2 evitado por ano', `${formatarNumero(r.co2EvitadoTonAno, 2)} toneladas/ano`)

  doc.setDrawColor(230, 230, 230)
  doc.line(14, y - 6, 196, y - 6)
  y += 4

  doc.setFontSize(11)
  doc.setTextColor(20, 20, 20)
  doc.text('Como chegamos a esse número', 14, y)
  y += 7
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  const premissas = [
    `Tarifa efetiva calculada a partir da sua fatura: ${formatarNumero(r.tarifaEfetiva, 3)} R$/kWh.`,
    `Produtividade solar da sua região aplicada ao dimensionamento do sistema.`,
    `Fator de autoconsumo simultâneo conforme regime de operação informado (Lei 14.300 / Fio B).`,
    `Custo do sistema baseado em médias de mercado por porte (kWp) — fonte: Greener.`,
    r.limitadoPorArea
      ? 'Dimensionamento ajustado pela área de telhado disponível informada.'
      : 'Dimensionamento calculado a partir do consumo médio informado.',
  ]
  premissas.forEach((p) => {
    const linhas = doc.splitTextToSize(`• ${p}`, 182)
    doc.text(linhas, 14, y)
    y += linhas.length * 5
  })

  y += 6
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  const aviso = doc.splitTextToSize(
    'Estimativa baseada em médias de mercado e dados públicos (CELESC, UFSC, ANEEL, Greener, MCTI). Não constitui proposta comercial fechada — o valor final é elaborado por um especialista Solarium Energy após visita técnica.',
    182,
  )
  doc.text(aviso, 14, y)

  doc.save(`diagnostico-solarium-energy-${dados.empresa.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}
