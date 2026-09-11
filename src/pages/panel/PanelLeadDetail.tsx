import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Logo from '../../components/Logo'
import { fetchLeads, panelIsLoggedIn } from '../../lib/leads'
import type { Lead } from '../../types'
import { formatarMoeda, formatarNumero } from '../../lib/calculations'
import { REGIME_LABEL, REGIAO_LABEL, type Regiao, type Regime } from '../../lib/constants'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">{label}</p>
      <p className="text-white mt-1">{value}</p>
    </div>
  )
}

export default function PanelLeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!panelIsLoggedIn()) {
      navigate('/painel')
      return
    }
    fetchLeads()
      .then((leads) => {
        const encontrado = leads.find((l) => l.id === id) ?? null
        setLead(encontrado)
        if (!encontrado) setErro('Lead não encontrado.')
      })
      .catch(() => setErro('Não foi possível carregar o lead.'))
      .finally(() => setCarregando(false))
  }, [id, navigate])

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Logo className="h-6" />
        <Link to="/painel/leads" className="text-sm text-slate-400 hover:text-white">
          ← Voltar para a lista
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {carregando && <p className="text-slate-400">Carregando...</p>}
        {erro && <p className="text-red-400">{erro}</p>}

        {lead && (
          <>
            <h1 className="font-display text-2xl font-semibold text-white">{lead.empresa}</h1>
            <p className="text-slate-400 mt-1">
              Recebido em {new Date(lead.created_at).toLocaleString('pt-BR')}
            </p>

            <section className="mt-8 rounded-xl border border-white/10 bg-ink-900 p-6">
              <h2 className="font-display font-semibold text-white mb-4">Dados de contato</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Nome" value={lead.nome || '—'} />
                <Field label="Cargo" value={lead.cargo ?? '—'} />
                <Field label="E-mail" value={lead.email || '—'} />
                <Field label="WhatsApp" value={lead.whatsapp} />
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-white/10 bg-ink-900 p-6">
              <h2 className="font-display font-semibold text-white mb-4">
                Respostas do formulário
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Segmento" value={lead.segmento} />
                <Field label="Cidade" value={lead.cidade} />
                <Field label="Região (produtividade solar)" value={REGIAO_LABEL[lead.regiao as Regiao]} />
                <Field label="Regime de operação" value={REGIME_LABEL[lead.regime_operacao as Regime]} />
                <Field label="Consumo médio" value={`${formatarNumero(lead.consumo_medio_kwh, 0)} kWh/mês`} />
                <Field label="Valor médio da conta" value={formatarMoeda(lead.valor_medio_conta)} />
                <Field
                  label="Área de telhado informada"
                  value={lead.area_disponivel_m2 ? `${formatarNumero(lead.area_disponivel_m2, 0)} m²` : 'Não informada'}
                />
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-solar-400/20 bg-ink-900 p-6">
              <h2 className="font-display font-semibold text-white mb-4">Diagnóstico calculado</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Tarifa efetiva" value={`R$ ${formatarNumero(lead.tarifa_efetiva, 3)}/kWh`} />
                <Field label="Economia mensal" value={`${formatarMoeda(lead.economia_mensal)}/mês`} />
                <Field
                  label="Sistema (kWp necessário / instalável)"
                  value={`${formatarNumero(lead.kwp_necessario)} / ${formatarNumero(lead.kwp_instalavel)} kWp`}
                />
                <Field
                  label="Limitado por área?"
                  value={lead.limitado_por_area ? 'Sim' : 'Não'}
                />
                <Field label="Geração mensal estimada" value={`${formatarNumero(lead.energia_gerada_mensal_kwh, 0)} kWh`} />
                <Field label="Fator de autoconsumo" value={`${Math.round(lead.fator_autoconsumo * 100)}%`} />
                <Field label="Investimento estimado" value={formatarMoeda(lead.investimento_estimado)} />
                <Field label="Payback" value={`${(lead.payback_meses / 12).toFixed(1)} anos`} />
                <Field label="Economia em 25 anos" value={formatarMoeda(lead.economia_acumulada_25anos)} />
                <Field label="CO2 evitado/ano" value={`${formatarNumero(lead.co2_evitado_ton_ano, 2)} ton`} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
