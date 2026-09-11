import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { panelLogin } from '../../lib/leads'

export default function PanelLogin() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (panelLogin(usuario, senha)) {
      navigate('/painel/leads')
    } else {
      setErro('Usuário ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-xl border border-white/10 bg-ink-900 p-8">
          <h1 className="font-display text-xl font-semibold text-white mb-1">Painel interno</h1>
          <p className="text-sm text-slate-400 mb-6">Acesso restrito à equipe Solarium Energy.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Usuário</label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
              />
            </div>
            {erro && <p className="text-sm text-red-400">{erro}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-solar-400 px-4 py-3 font-semibold text-ink-950 hover:bg-solar-300 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
