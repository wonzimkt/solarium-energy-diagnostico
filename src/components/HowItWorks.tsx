const steps = [
  {
    n: '01',
    title: 'Preencha os dados do seu consumo',
    desc: 'Segmento, cidade, regime de operação e valores da sua conta de energia — leva menos de 2 minutos.',
  },
  {
    n: '02',
    title: 'Nosso sistema calcula sua economia',
    desc: 'Aplicamos dados reais de produtividade solar de SC e a regra vigente da Lei 14.300 (Fio B).',
  },
  {
    n: '03',
    title: 'Receba seu diagnóstico personalizado',
    desc: 'Economia mensal, payback, investimento estimado e impacto ambiental — na hora, na tela.',
  },
]

export default function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-b border-white/5">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white text-center mb-14">
        Como funciona
      </h2>
      <div className="grid sm:grid-cols-3 gap-8">
        {steps.map((s) => (
          <div key={s.n} className="relative">
            <span className="font-mono text-5xl font-bold text-white/10">{s.n}</span>
            <h3 className="font-display font-semibold text-lg text-white mt-2">{s.title}</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
