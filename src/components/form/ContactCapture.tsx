import { useState } from 'react'
import { FieldLabel, PrimaryButton, ErrorText } from './FormShell'
import { formatarMoeda } from '../../lib/calculations'

export default function ContactCapture({
  economiaMensalPreview,
  onSubmit,
  submitting,
  erroSubmit,
}: {
  economiaMensalPreview: number
  onSubmit: (dados: {
    nome: string
    email: string
    whatsapp: string
    empresa: string
    cargo: string
  }) => void
  submitting: boolean
  erroSubmit: string | null
}) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [cargo, setCargo] = useState('')
  const [erros, setErros] = useState<string[]>([])

  function validarEnviar() {
    const novosErros: string[] = []
    if (!nome.trim()) novosErros.push('Informe seu nome.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.push('Informe um e-mail válido.')
    if (whatsapp.replace(/\D/g, '').length < 10) novosErros.push('Informe um WhatsApp válido com DDD.')
    if (!empresa.trim()) novosErros.push('Informe o nome da empresa.')

    if (novosErros.length > 0) {
      setErros(novosErros)
      return
    }
    setErros([])
    onSubmit({ nome, email, whatsapp, empresa, cargo })
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-xl border border-solar-400/20 bg-gradient-to-b from-solar-400/10 to-transparent p-6 text-center mb-8">
        <p className="text-sm text-slate-300">Sua economia estimada é de</p>
        <p className="font-mono text-4xl font-bold text-solar-400 mt-1 blur-sm select-none">
          {formatarMoeda(economiaMensalPreview)}/mês
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Preencha seus dados para revelar o relatório completo
        </p>
      </div>

      <h2 className="font-display text-2xl font-semibold text-white">Quase lá</h2>
      <p className="text-slate-400 mt-2">
        Enviamos seu diagnóstico completo agora e um especialista Solarium Energy pode entrar em
        contato para detalhar a proposta.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <FieldLabel>Nome completo</FieldLabel>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>E-mail</FieldLabel>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
            />
          </div>
          <div>
            <FieldLabel>WhatsApp</FieldLabel>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(47) 99999-9999"
              className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Empresa</FieldLabel>
            <input
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
            />
          </div>
          <div>
            <FieldLabel>Cargo (opcional)</FieldLabel>
            <input
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
            />
          </div>
        </div>

        {erros.map((e) => (
          <ErrorText key={e}>{e}</ErrorText>
        ))}
        {erroSubmit && <ErrorText>{erroSubmit}</ErrorText>}

        <PrimaryButton onClick={validarEnviar} disabled={submitting}>
          {submitting ? 'Enviando...' : 'Ver meu diagnóstico completo'}
        </PrimaryButton>
        <p className="text-xs text-slate-500">
          Seus dados são usados apenas para enviar seu diagnóstico e contato comercial da Solarium
          Energy.
        </p>
      </div>
    </div>
  )
}
