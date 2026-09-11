const diferenciais = [
  {
    title: 'Especialistas em indústria',
    desc: 'Não trabalhamos com residências ou comércio — entendemos a curva de carga e a operação de plantas industriais.',
  },
  {
    title: 'Projeto sob medida',
    desc: 'Dimensionamento considerando seu regime de operação, área disponível e a regra vigente do Fio B.',
  },
  {
    title: 'Acompanhamento técnico completo',
    desc: 'Da homologação junto à CELESC à instalação e manutenção do sistema.',
  },
]

const faqs = [
  {
    q: 'É possível financiar o sistema solar?',
    a: 'Sim. Existem linhas de financiamento específicas para energia solar industrial, com prazos que costumam acompanhar o payback estimado do projeto. Um especialista Solarium apresenta as opções disponíveis para o seu caso.',
  },
  {
    q: 'Quanto tempo leva a instalação?',
    a: 'Depende do porte do sistema, mas projetos industriais costumam ser instalados em poucas semanas após a aprovação do projeto e materiais em mãos.',
  },
  {
    q: 'O sistema precisa de manutenção?',
    a: 'Sim, uma manutenção preventiva periódica (limpeza dos módulos e checagem elétrica) garante a performance ao longo dos 25 anos de vida útil do sistema.',
  },
  {
    q: 'O que acontece se minha indústria parar no fim de semana?',
    a: 'A energia gerada e não consumida na hora é injetada na rede e compensada depois, sujeita à cobrança progressiva do Fio B (Lei 14.300). Por isso o regime de operação informado influencia diretamente sua economia.',
  },
  {
    q: 'Qual a garantia dos equipamentos?',
    a: 'Os módulos fotovoltaicos costumam ter garantia de performance de 25 anos, e os inversores entre 5 e 12 anos, variando por fabricante — detalhamos isso na proposta técnica.',
  },
]

export default function InstitutionalSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 space-y-20">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
          Por que energia solar para indústrias
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Indústrias operam, em geral, durante o dia — exatamente quando o sol gera mais energia.
          Isso significa um alto fator de autoconsumo simultâneo, que hoje é o critério mais
          importante para a economia real do projeto diante da Lei 14.300. Some a isso o fato de
          Santa Catarina ter uma das tarifas industriais mais caras em trajetória de reajuste (alta
          de 15,8% em 2025) e uma produtividade solar 30% superior à das melhores regiões da
          Alemanha — o resultado é um dos cenários mais favoráveis do país para energia solar
          industrial.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-8">
          Diferenciais Solarium Energy
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {diferenciais.map((d) => (
            <div key={d.title} className="rounded-xl border border-white/10 bg-ink-900 p-6">
              <h3 className="font-display font-semibold text-white mb-2">{d.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-8">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-white/10 bg-ink-900 px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex justify-between items-center cursor-pointer font-medium text-white">
                {f.q}
                <span className="text-slate-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
