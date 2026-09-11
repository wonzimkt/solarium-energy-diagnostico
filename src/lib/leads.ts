import { supabase } from './supabase'
import { calcularDiagnostico } from './calculations'
import type { FormularioDados, Lead } from '../types'

export async function salvarLead(dados: FormularioDados) {
  const resultado = calcularDiagnostico({
    consumoMedioKwh: dados.consumoMedioKwh,
    valorMedioConta: dados.valorMedioConta,
    regiao: dados.regiao,
    regime: dados.regime,
    areaDisponivelM2: dados.areaDisponivelM2,
  })

  const { error } = await supabase.from('leads').insert({
    nome: dados.nome,
    email: dados.email,
    whatsapp: dados.whatsapp,
    empresa: dados.empresa,
    cargo: dados.cargo || null,
    segmento: dados.segmento,
    cidade: dados.cidade,
    regiao: dados.regiao,
    regime_operacao: dados.regime,
    consumo_medio_kwh: dados.consumoMedioKwh,
    valor_medio_conta: dados.valorMedioConta,
    area_disponivel_m2: dados.areaDisponivelM2,
    tarifa_efetiva: resultado.tarifaEfetiva,
    kwp_necessario: resultado.kwpNecessario,
    kwp_instalavel: resultado.kwpInstalavel,
    area_necessaria_m2: resultado.areaNecessariaM2,
    limitado_por_area: resultado.limitadoPorArea,
    energia_gerada_mensal_kwh: resultado.energiaGeradaMensalKwh,
    fator_autoconsumo: resultado.fatorAutoconsumo,
    economia_mensal: resultado.economiaMensal,
    investimento_estimado: resultado.investimentoEstimado,
    payback_meses: resultado.paybackMeses,
    economia_acumulada_25anos: resultado.economiaAcumulada25Anos,
    co2_evitado_ton_ano: resultado.co2EvitadoTonAno,
  })

  if (error) throw error

  return resultado
}

const PANEL_SESSION_KEY = 'solarium_panel_session'

export function panelLogin(usuario: string, senha: string): boolean {
  const ok =
    usuario === import.meta.env.VITE_PANEL_USERNAME &&
    senha === import.meta.env.VITE_PANEL_PASSWORD
  if (ok) {
    sessionStorage.setItem(PANEL_SESSION_KEY, senha)
  }
  return ok
}

export function panelLogout() {
  sessionStorage.removeItem(PANEL_SESSION_KEY)
}

export function panelIsLoggedIn(): boolean {
  return sessionStorage.getItem(PANEL_SESSION_KEY) !== null
}

export async function fetchLeads(): Promise<Lead[]> {
  const senha = sessionStorage.getItem(PANEL_SESSION_KEY)
  if (!senha) throw new Error('Não autenticado')

  const { data, error } = await supabase.functions.invoke<{ leads: Lead[] }>('panel-leads', {
    body: { senha },
  })

  if (error) throw error
  return data?.leads ?? []
}
