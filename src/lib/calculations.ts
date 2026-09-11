import {
  AREA_M2_POR_KWP,
  CUSTO_RS_POR_KWP,
  DEGRADACAO_ANUAL_PAINEL,
  FATOR_AUTOCONSUMO,
  FATOR_EMISSAO_CO2_TON_MWH,
  PERCENTUAL_FIO_B_COBRADO_2026,
  PERCENTUAL_FIO_B_NA_TARIFA,
  PRODUTIVIDADE_KWH_KWP_ANO,
  REAJUSTE_TARIFARIO_MEDIO_ANUAL,
  TARIFA_MAX_PLAUSIVEL,
  TARIFA_MIN_PLAUSIVEL,
  TAXA_CDI_ANUAL_REFERENCIA,
  VIDA_UTIL_SISTEMA_ANOS,
  type Regiao,
  type Regime,
} from './constants'

export interface DiagnosticoInput {
  consumoMedioKwh: number
  valorMedioConta: number
  regiao: Regiao
  regime: Regime
  areaDisponivelM2: number | null
}

export interface DiagnosticoResultado {
  tarifaEfetiva: number
  tarifaForaDaFaixa: boolean
  consumoAnualKwh: number
  kwpNecessario: number
  areaNecessariaM2: number
  kwpInstalavel: number
  limitadoPorArea: boolean
  energiaGeradaMensalKwh: number
  fatorAutoconsumo: number
  energiaAutoconsumidaKwh: number
  energiaInjetadaKwh: number
  tarifaLiquidaEnergiaInjetada: number
  economiaMensal: number
  percentualEconomia: number
  investimentoEstimado: number
  paybackMeses: number
  paybackAnos: number
  paybackAnosResto: number
  economiaAcumulada25Anos: number
  economiaAcumulada25AnosAvancada: number
  economiaInvestidaCDI25Anos: number
  co2EvitadoTonAno: number
}

function custoPorKwp(kwp: number): number {
  const faixa = CUSTO_RS_POR_KWP.find((f) => kwp <= f.limite)
  return faixa ? faixa.custo : CUSTO_RS_POR_KWP[CUSTO_RS_POR_KWP.length - 1].custo
}

export function calcularDiagnostico(input: DiagnosticoInput): DiagnosticoResultado {
  const { consumoMedioKwh, valorMedioConta, regiao, regime, areaDisponivelM2 } = input

  // 6.1 — tarifa efetiva do cliente
  const tarifaEfetiva = valorMedioConta / consumoMedioKwh
  const tarifaForaDaFaixa =
    tarifaEfetiva < TARIFA_MIN_PLAUSIVEL || tarifaEfetiva > TARIFA_MAX_PLAUSIVEL

  // 6.3 — dimensionamento do sistema e restrição de área
  const produtividade = PRODUTIVIDADE_KWH_KWP_ANO[regiao]
  const consumoAnualKwh = consumoMedioKwh * 12
  const kwpNecessario = consumoAnualKwh / produtividade
  const areaNecessariaM2 = kwpNecessario * AREA_M2_POR_KWP

  let kwpInstalavel = kwpNecessario
  let limitadoPorArea = false
  if (areaDisponivelM2 !== null && areaDisponivelM2 < areaNecessariaM2) {
    kwpInstalavel = areaDisponivelM2 / AREA_M2_POR_KWP
    limitadoPorArea = true
  }

  // 6.4 — autoconsumo simultâneo x energia injetada (Lei 14.300 / Fio B)
  const fatorAutoconsumo = FATOR_AUTOCONSUMO[regime]
  const energiaGeradaMensalKwh = (kwpInstalavel * produtividade) / 12
  const energiaAutoconsumidaKwh = energiaGeradaMensalKwh * fatorAutoconsumo
  const energiaInjetadaKwh = energiaGeradaMensalKwh * (1 - fatorAutoconsumo)

  const descontoPorFioBNoKwhInjetado =
    tarifaEfetiva * PERCENTUAL_FIO_B_NA_TARIFA * PERCENTUAL_FIO_B_COBRADO_2026
  const tarifaLiquidaEnergiaInjetada = tarifaEfetiva - descontoPorFioBNoKwhInjetado

  const economiaMensal =
    energiaAutoconsumidaKwh * tarifaEfetiva + energiaInjetadaKwh * tarifaLiquidaEnergiaInjetada

  const percentualEconomia = economiaMensal / valorMedioConta

  // 6.5 — investimento estimado
  const investimentoEstimado = kwpInstalavel * custoPorKwp(kwpInstalavel)

  // 6.6 — payback
  const paybackMeses = investimentoEstimado / economiaMensal
  const paybackAnos = Math.floor(paybackMeses / 12)
  const paybackAnosResto = Math.round(paybackMeses - paybackAnos * 12)

  // 6.7 — economia acumulada em 25 anos (versão simples + avançada com reajuste/degradação)
  const economiaAcumulada25Anos = economiaMensal * 12 * VIDA_UTIL_SISTEMA_ANOS

  let economiaAcumulada25AnosAvancada = 0
  let economiaAnoBase = economiaMensal * 12
  for (let ano = 0; ano < VIDA_UTIL_SISTEMA_ANOS; ano++) {
    const fatorDegradacao = 1 - DEGRADACAO_ANUAL_PAINEL * ano
    economiaAcumulada25AnosAvancada += economiaAnoBase * fatorDegradacao
    economiaAnoBase *= 1 + REAJUSTE_TARIFARIO_MEDIO_ANUAL
  }

  // Comparativo ilustrativo: quanto renderia a mesma economia mensal se fosse investida
  // todo mês a uma taxa de referência do CDI, em vez de somada de forma simples (seção 6.7 avançada)
  const iMensalCdi = Math.pow(1 + TAXA_CDI_ANUAL_REFERENCIA, 1 / 12) - 1
  const nMeses = VIDA_UTIL_SISTEMA_ANOS * 12
  const economiaInvestidaCDI25Anos =
    economiaMensal * ((Math.pow(1 + iMensalCdi, nMeses) - 1) / iMensalCdi)

  // 6.8 — impacto ambiental
  const co2EvitadoTonAno =
    ((energiaGeradaMensalKwh * 12) / 1000) * FATOR_EMISSAO_CO2_TON_MWH

  return {
    tarifaEfetiva,
    tarifaForaDaFaixa,
    consumoAnualKwh,
    kwpNecessario,
    areaNecessariaM2,
    kwpInstalavel,
    limitadoPorArea,
    energiaGeradaMensalKwh,
    fatorAutoconsumo,
    energiaAutoconsumidaKwh,
    energiaInjetadaKwh,
    tarifaLiquidaEnergiaInjetada,
    economiaMensal,
    percentualEconomia,
    investimentoEstimado,
    paybackMeses,
    paybackAnos,
    paybackAnosResto,
    economiaAcumulada25Anos,
    economiaAcumulada25AnosAvancada,
    economiaInvestidaCDI25Anos,
    co2EvitadoTonAno,
  }
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatarNumero(valor: number, casas = 1): string {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

export function formatarPercentual(valor: number, casas = 0): string {
  return valor.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

export function formatarPayback(anos: number, meses: number): string {
  const anosTexto = anos === 1 ? '1 ano' : `${anos} anos`
  if (meses === 0) return anosTexto
  const mesesTexto = meses === 1 ? '1 mês' : `${meses} meses`
  return `${anosTexto} e ${mesesTexto}`
}
