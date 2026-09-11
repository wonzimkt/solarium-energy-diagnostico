export type Regiao = 'oeste' | 'litoral_serra_meio_oeste' | 'vale_sul'
export type Regime = 'turno_1' | 'turno_2' | 'turno_3'

export const PRODUTIVIDADE_KWH_KWP_ANO: Record<Regiao, number> = {
  oeste: 1320,
  litoral_serra_meio_oeste: 1250,
  vale_sul: 1180,
}

export const REGIAO_LABEL: Record<Regiao, string> = {
  oeste: 'Oeste',
  litoral_serra_meio_oeste: 'Litoral, Serra e Meio-Oeste',
  vale_sul: 'Vale e Sul',
}

export const AREA_M2_POR_KWP = 6

export const FATOR_AUTOCONSUMO: Record<Regime, number> = {
  turno_1: 0.6,
  turno_2: 0.8,
  turno_3: 0.92,
}

export const REGIME_LABEL: Record<Regime, string> = {
  turno_1: '1 turno (diurno)',
  turno_2: '2 turnos',
  turno_3: '3 turnos / 24h contínuo',
}

// Lei 14.300 (Marco Legal da GD) — cronograma de cobrança do Fio B sobre energia injetada/compensada
export const PERCENTUAL_FIO_B_NA_TARIFA = 0.3
export const PERCENTUAL_FIO_B_COBRADO_2026 = 0.6

// Greener — custo médio de mercado por kWp instalado, conforme porte do sistema
export const CUSTO_RS_POR_KWP: { limite: number; custo: number }[] = [
  { limite: 75, custo: 1800 },
  { limite: 150, custo: 1625 },
  { limite: 1000, custo: 1500 },
  { limite: Infinity, custo: 1430 },
]

// MCTI/SIN — fator médio de emissão de CO2 do Sistema Interligado Nacional (validar valor vigente antes do lançamento)
export const FATOR_EMISSAO_CO2_TON_MWH = 0.05

export const REAJUSTE_TARIFARIO_MEDIO_ANUAL = 0.08
export const DEGRADACAO_ANUAL_PAINEL = 0.005
export const VIDA_UTIL_SISTEMA_ANOS = 25

// Faixa de tarifa efetiva plausível (R$/kWh) para o alerta de sanity-check (seção 6.1)
export const TARIFA_MIN_PLAUSIVEL = 0.45
export const TARIFA_MAX_PLAUSIVEL = 1.2

export const SEGMENTOS_INDUSTRIAIS = [
  'Metalmecânico',
  'Têxtil',
  'Alimentício',
  'Químico/Plástico',
  'Madeireiro/Moveleiro',
  'Cerâmico',
  'Frigorífico',
  'Outro',
] as const

export const CIDADES_SC: { nome: string; regiao: Regiao }[] = [
  // Oeste
  { nome: 'Chapecó', regiao: 'oeste' },
  { nome: 'Xanxerê', regiao: 'oeste' },
  { nome: 'São Miguel do Oeste', regiao: 'oeste' },
  { nome: 'Concórdia', regiao: 'oeste' },
  { nome: 'Maravilha', regiao: 'oeste' },
  { nome: 'Palmitos', regiao: 'oeste' },
  { nome: 'Xaxim', regiao: 'oeste' },
  { nome: 'São Lourenço do Oeste', regiao: 'oeste' },
  { nome: 'Pinhalzinho', regiao: 'oeste' },
  { nome: 'Itapiranga', regiao: 'oeste' },
  { nome: 'Quilombo', regiao: 'oeste' },
  { nome: 'Dionísio Cerqueira', regiao: 'oeste' },
  // Litoral, Serra e Meio-Oeste
  { nome: 'Florianópolis', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Joinville', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'São José', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Palhoça', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Lages', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'São Bento do Sul', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Jaraguá do Sul', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Joaçaba', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Videira', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Campos Novos', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Curitibanos', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Caçador', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Fraiburgo', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Balneário Camboriú', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Itapema', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Tijucas', regiao: 'litoral_serra_meio_oeste' },
  { nome: 'Biguaçu', regiao: 'litoral_serra_meio_oeste' },
  // Vale e Sul
  { nome: 'Blumenau', regiao: 'vale_sul' },
  { nome: 'Itajaí', regiao: 'vale_sul' },
  { nome: 'Brusque', regiao: 'vale_sul' },
  { nome: 'Gaspar', regiao: 'vale_sul' },
  { nome: 'Indaial', regiao: 'vale_sul' },
  { nome: 'Rio do Sul', regiao: 'vale_sul' },
  { nome: 'Timbó', regiao: 'vale_sul' },
  { nome: 'Ibirama', regiao: 'vale_sul' },
  { nome: 'Criciúma', regiao: 'vale_sul' },
  { nome: 'Tubarão', regiao: 'vale_sul' },
  { nome: 'Araranguá', regiao: 'vale_sul' },
  { nome: 'Içara', regiao: 'vale_sul' },
  { nome: 'Laguna', regiao: 'vale_sul' },
  { nome: 'Braço do Norte', regiao: 'vale_sul' },
  { nome: 'Orleans', regiao: 'vale_sul' },
  // fallback genérico — usa a média estadual (faixa intermediária)
  { nome: 'Outra cidade de Santa Catarina', regiao: 'litoral_serra_meio_oeste' },
]
