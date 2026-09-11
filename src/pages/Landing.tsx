import { useState } from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import LeadCapture from '../components/form/LeadCapture'
import Qualification from '../components/form/Qualification'
import NotIndustry from '../components/form/NotIndustry'
import StepSegmentoCidade from '../components/form/StepSegmentoCidade'
import StepRegime from '../components/form/StepRegime'
import StepConsumo from '../components/form/StepConsumo'
import LoadingCalculating from '../components/form/LoadingCalculating'
import ResultDashboard from '../components/ResultDashboard'
import InstitutionalSection from '../components/InstitutionalSection'
import Footer from '../components/Footer'
import { calcularDiagnostico, type DiagnosticoResultado } from '../lib/calculations'
import { salvarLead } from '../lib/leads'
import type { FormularioDados } from '../types'
import type { Regiao, Regime } from '../lib/constants'

type Estagio =
  | 'hero'
  | 'lead_capture'
  | 'qualificacao'
  | 'nao_industria'
  | 'segmento_cidade'
  | 'regime'
  | 'consumo'
  | 'calculando'
  | 'resultado'

export default function Landing() {
  const [estagio, setEstagio] = useState<Estagio>('hero')

  const [empresa, setEmpresa] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  const [segmento, setSegmento] = useState('')
  const [cidade, setCidade] = useState('')
  const [regiao, setRegiao] = useState<Regiao>('litoral_serra_meio_oeste')
  const [regime, setRegime] = useState<Regime | ''>('')
  const [consumoMedioKwh, setConsumoMedioKwh] = useState<number | null>(null)
  const [valorMedioConta, setValorMedioConta] = useState<number | null>(null)
  const [areaDisponivelM2, setAreaDisponivelM2] = useState<number | null>(null)

  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null)
  const [dadosFinal, setDadosFinal] = useState<FormularioDados | null>(null)

  async function calcularESalvar() {
    if (!regime || consumoMedioKwh === null || valorMedioConta === null) return

    const dados: FormularioDados = {
      empresa,
      whatsapp,
      nome: '',
      email: '',
      cargo: '',
      segmento,
      cidade,
      regiao,
      regime,
      consumoMedioKwh,
      valorMedioConta,
      areaDisponivelM2,
    }

    const r = calcularDiagnostico({
      consumoMedioKwh,
      valorMedioConta,
      regiao,
      regime,
      areaDisponivelM2,
    })
    setResultado(r)
    setDadosFinal(dados)

    try {
      await salvarLead(dados)
    } catch {
      // segue exibindo o diagnóstico mesmo se a gravação do lead falhar
    }

    setEstagio('resultado')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {estagio === 'hero' && (
        <>
          <Hero onStart={() => setEstagio('lead_capture')} />
          <HowItWorks />
          <InstitutionalSection />
          <Footer />
        </>
      )}

      {estagio !== 'hero' && (
        <main className="flex-1 px-6 py-16 sm:py-24">
          {estagio === 'lead_capture' && (
            <LeadCapture
              empresa={empresa}
              whatsapp={whatsapp}
              onNext={(emp, tel) => {
                setEmpresa(emp)
                setWhatsapp(tel)
                setEstagio('qualificacao')
              }}
            />
          )}

          {estagio === 'qualificacao' && (
            <Qualification
              onYes={() => setEstagio('segmento_cidade')}
              onNo={() => setEstagio('nao_industria')}
            />
          )}

          {estagio === 'nao_industria' && (
            <NotIndustry onBack={() => setEstagio('hero')} />
          )}

          {estagio === 'segmento_cidade' && (
            <StepSegmentoCidade
              segmento={segmento}
              cidade={cidade}
              onBack={() => setEstagio('qualificacao')}
              onNext={(seg, cid, reg) => {
                setSegmento(seg)
                setCidade(cid)
                setRegiao(reg)
                setEstagio('regime')
              }}
            />
          )}

          {estagio === 'regime' && (
            <StepRegime
              regime={regime}
              onBack={() => setEstagio('segmento_cidade')}
              onNext={(r) => {
                setRegime(r)
                setEstagio('consumo')
              }}
            />
          )}

          {estagio === 'consumo' && (
            <StepConsumo
              consumoMedioKwh={consumoMedioKwh}
              valorMedioConta={valorMedioConta}
              areaDisponivelM2={areaDisponivelM2}
              onBack={() => setEstagio('regime')}
              onNext={(c, v, a) => {
                setConsumoMedioKwh(c)
                setValorMedioConta(v)
                setAreaDisponivelM2(a)
                setEstagio('calculando')
              }}
            />
          )}

          {estagio === 'calculando' && (
            <LoadingCalculating onDone={calcularESalvar} />
          )}

          {estagio === 'resultado' && resultado && dadosFinal && (
            <ResultDashboard dados={dadosFinal} r={resultado} />
          )}
        </main>
      )}

      {estagio === 'resultado' && (
        <>
          <InstitutionalSection />
          <Footer />
        </>
      )}
    </div>
  )
}
