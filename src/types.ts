import type { Regiao, Regime } from './lib/constants'

export interface FormularioDados {
  segmento: string
  cidade: string
  regiao: Regiao
  regime: Regime
  consumoMedioKwh: number
  valorMedioConta: number
  areaDisponivelM2: number | null
  nome: string
  email: string
  whatsapp: string
  empresa: string
  cargo: string
}

export interface Lead {
  id: string
  created_at: string
  nome: string
  email: string
  whatsapp: string
  empresa: string
  cargo: string | null
  segmento: string
  cidade: string
  regiao: string
  regime_operacao: string
  consumo_medio_kwh: number
  valor_medio_conta: number
  area_disponivel_m2: number | null
  tarifa_efetiva: number
  kwp_necessario: number
  kwp_instalavel: number
  area_necessaria_m2: number
  limitado_por_area: boolean
  energia_gerada_mensal_kwh: number
  fator_autoconsumo: number
  economia_mensal: number
  investimento_estimado: number
  payback_meses: number
  economia_acumulada_25anos: number
  co2_evitado_ton_ano: number
}
