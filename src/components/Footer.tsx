import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo className="h-6" />
        <p className="text-xs text-slate-500 text-center sm:text-right">
          Diagnóstico estimado com base em médias de mercado e dados públicos. Não substitui uma
          proposta técnica personalizada.
          <br />
          <Link to="/painel" className="hover:text-slate-300">
            Área interna
          </Link>
        </p>
      </div>
    </footer>
  )
}
