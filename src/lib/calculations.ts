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
  investimentoEstimado: number
  paybackMeses: number
  paybackAnos: number
  paybackAnosResto: number
  economiaAcumulada25Anos: number
  economiaAcumulada25AnosAvancada: number
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
    investimentoEstimado,
    paybackMeses,
    paybackAnos,
    paybackAnosResto,
    economiaAcumulada25Anos,
    economiaAcumulada25AnosAvancada,
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

export function formatarPayback(anos: number, meses: number): string {
  const anosTexto = anos === 1 ? '1 ano' : `${anos} anos`
  if (meses === 0) return anosTexto
  const mesesTexto = meses === 1 ? '1 mês' : `${meses} meses`
  return `${anosTexto} e ${mesesTexto}`
}
