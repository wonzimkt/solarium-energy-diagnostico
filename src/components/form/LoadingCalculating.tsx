import { useEffect, useState } from 'react'

const mensagens = [
  'Analisando o potencial solar da sua região...',
  'Aplicando a regra vigente da Lei 14.300 (Fio B)...',
  'Calculando seu payback...',
  'Montando seu diagnóstico personalizado...',
]

export default function LoadingCalculating({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => Math.min(i + 1, mensagens.length - 1))
    }, 650)
    const timeout = setTimeout(onDone, 2600)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onDone])

  return (
    <div className="max-w-xl mx-auto text-center py-24">
      <div className="mx-auto h-16 w-16 rounded-full border-2 border-solar-400/30 border-t-solar-400 animate-spin" />
      <p className="mt-8 font-display text-lg text-white transition-opacity duration-300">
        {mensagens[idx]}
      </p>
    </div>
  )
}
