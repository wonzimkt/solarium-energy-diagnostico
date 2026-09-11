import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { fetchLeads, panelIsLoggedIn, panelLogout } from '../../lib/leads'
import type { Lead } from '../../types'
import { formatarMoeda } from '../../lib/calculations'

type Ordenacao = 'data' | 'economia'

export default function PanelDashboard() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('data')

  useEffect(() => {
    if (!panelIsLoggedIn()) {
      navigate('/painel')
      return
    }
    fetchLeads()
      .then(setLeads)
      .catch(() => setErro('Não foi possível carregar os leads.'))
      .finally(() => setCarregando(false))
  }, [navigate])

  const leadsOrdenados = useMemo(() => {
    const copia = [...leads]
    if (ordenacao === 'economia') {
      copia.sort((a, b) => b.economia_mensal - a.economia_mensal)
    } else {
      copia.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return copia
  }, [leads, ordenacao])

  function sair() {
    panelLogout()
    navigate('/painel')
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Logo className="h-6" />
        <button onClick={sair} className="text-sm text-slate-400 hover:text-white">
          Sair
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">Leads recebidos</h1>
            <p className="text-slate-400 text-sm mt-1">
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'} no total
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOrdenacao('data')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                ordenacao === 'data'
                  ? 'bg-solar-400 text-ink-950'
                  : 'bg-ink-800 text-slate-300 border border-white/10'
              }`}
            >
              Mais recentes
            </button>
            <button
              onClick={() => setOrdenacao('economia')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                ordenacao === 'economia'
                  ? 'bg-solar-400 text-ink-950'
                  : 'bg-ink-800 text-slate-300 border border-white/10'
              }`}
            >
              Maior economia
            </button>
          </div>
        </div>

        {carregando && <p className="text-slate-400">Carregando leads...</p>}
        {erro && <p className="text-red-400">{erro}</p>}

        {!carregando && !erro && leads.length === 0 && (
          <p className="text-slate-500">Nenhum lead recebido ainda.</p>
        )}

        <div className="grid gap-4">
          {leadsOrdenados.map((lead) => (
            <Link
              key={lead.id}
              to={`/painel/leads/${lead.id}`}
              className="rounded-xl border border-white/10 bg-ink-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-solar-400/40 transition"
            >
              <div>
                <p className="font-semibold text-white">
                  {lead.empresa}
                  {lead.nome && <span className="text-slate-500 font-normal"> · {lead.nome}</span>}
                </p>
                <p className="text-sm text-slate-400 mt-0.5">
                  {lead.whatsapp} · {lead.segmento} · {lead.cidade} ·{' '}
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-mono text-lg font-bold text-solar-400">
                  {formatarMoeda(lead.economia_mensal)}/mês
                </p>
                <p className="text-xs text-slate-500">
                  Payback: {(lead.payback_meses / 12).toFixed(1)} anos
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
