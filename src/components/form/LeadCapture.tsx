import { useState } from 'react'
import FormShell, { FieldLabel, PrimaryButton, ErrorText } from './FormShell'

export default function LeadCapture({
  empresa,
  whatsapp,
  onNext,
}: {
  empresa: string
  whatsapp: string
  onNext: (empresa: string, whatsapp: string) => void
}) {
  const [emp, setEmp] = useState(empresa)
  const [tel, setTel] = useState(whatsapp)
  const [erros, setErros] = useState<string[]>([])

  function continuar() {
    const novosErros: string[] = []
    if (!emp.trim()) novosErros.push('Informe o nome da empresa.')
    if (tel.replace(/\D/g, '').length < 10) novosErros.push('Informe um telefone válido com DDD.')

    if (novosErros.length > 0) {
      setErros(novosErros)
      return
    }
    setErros([])
    onNext(emp, tel)
  }

  return (
    <FormShell
      step={1}
      total={4}
      title="Vamos começar"
      subtitle="Só precisamos de duas informações para liberar seu diagnóstico personalizado."
    >
      <div className="space-y-6">
        <div>
          <FieldLabel>Nome da empresa</FieldLabel>
          <input
            value={emp}
            onChange={(e) => setEmp(e.target.value)}
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
            autoFocus
          />
        </div>

        <div>
          <FieldLabel>Telefone / WhatsApp</FieldLabel>
          <input
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="(47) 99999-9999"
            className="w-full rounded-lg bg-ink-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-400/50"
          />
        </div>

        {erros.map((e) => (
          <ErrorText key={e}>{e}</ErrorText>
        ))}

        <PrimaryButton onClick={continuar}>Continuar</PrimaryButton>
      </div>
    </FormShell>
  )
}
