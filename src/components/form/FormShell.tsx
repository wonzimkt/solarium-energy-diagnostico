import { type ReactNode } from 'react'
import ProgressBar from '../ProgressBar'

export default function FormShell({
  step,
  total,
  title,
  subtitle,
  children,
  onBack,
}: {
  step: number
  total: number
  title: string
  subtitle?: string
  children: ReactNode
  onBack?: () => void
}) {
  return (
    <div className="max-w-xl mx-auto">
      <ProgressBar step={step} total={total} />

      <div className="mt-10">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-slate-300 mb-4 inline-flex items-center gap-1"
          >
            ← Voltar
          </button>
        )}
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 mt-2">{subtitle}</p>}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <label className="block mb-2">
      <span className="text-sm font-medium text-slate-200">{children}</span>
      {hint && <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>}
    </label>
  )
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <p className="text-sm text-red-400 mt-1.5">{children}</p>
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-solar-400 px-7 py-3.5 font-semibold text-ink-950 transition hover:bg-solar-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-solar-400"
    >
      {children}
    </button>
  )
}
