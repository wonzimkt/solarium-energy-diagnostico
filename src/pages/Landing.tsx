import { useState } from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Qualification from '../components/form/Qualification'
import NotIndustry from '../components/form/NotIndustry'
import StepSegmentoCidade from '../components/form/StepSegmentoCidade'
import StepRegime from '../components/form/StepRegime'
import StepConsumo from '../components/form/StepConsumo'
import LoadingCalculating from '../components/form/LoadingCalculating'
import ContactCapture from '../components/form/ContactCapture'
import ResultDashboard from '../components/ResultDashboard'
import InstitutionalSection from '../components/InstitutionalSection'
import Footer from '../components/Footer'
import { calcularDiagnostico, type DiagnosticoResultado } from '../lib/calculations'
import { salvarLead } from '../lib/leads'
import type { FormularioDados } from '../types'
import type { Regiao, Regime } from '../lib/constants'

type Estagio =
  | 'hero'
  | 'qualificacao'
  | 'nao_industria'
  | 'segmento_cidade'
  | 'regime'
  | 'consumo'
  | 'calculando'
  | 'contato'
  | 'resultado'

export default function Landing() {
  const [estagio, setEstagio] = useState<Estagio>('hero')

  const [segmento, setSegmento] = useState('')
  const [cidade, setCidade] = useState('')
  const [regiao, setRegiao] = useState<Regiao>('litoral_serra_meio_oeste')
  const [regime, setRegime] = useState<Regime | ''>('')
  const [consumoMedioKwh, setConsumoMedioKwh] = useState<number | null>(null)
  const [valorMedioConta, setValorMedioConta] = useState<number | null>(null)
  const [areaDisponivelM2, setAreaDisponivelM2] = useState<number | null>(null)

  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null)
  const [dadosFinal, setDadosFinal] = useState<FormularioDados | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  function calcularEIrParaContato() {
    if (!regime || consumoMedioKwh === null || valorMedioConta === null) return
    const r = calcularDiagnostico({
      consumoMedioKwh,
      valorMedioConta,
      regiao,
      regime,
      areaDisponivelM2,
    })
    setResultado(r)
    setEstagio('calculando')
  }

  async function handleContactSubmit(contato: {
    nome: string
    email: string
    whatsapp: string
    empresa: string
    cargo: string
  }) {
    if (!regime || consumoMedioKwh === null || valorMedioConta === null) return
    setEnviando(true)
    setErroEnvio(null)

    const dados: FormularioDados = {
      segmento,
      cidade,
      regiao,
      regime,
      consumoMedioKwh,
      valorMedioConta,
      areaDisponivelM2,
      ...contato,
    }

    try {
      const r = await salvarLead(dados)
      setResultado(r)
      setDadosFinal(dados)
      setEstagio('resultado')
    } catch (e) {
      setErroEnvio('Não foi possível enviar seus dados agora. Tente novamente em instantes.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {estagio === 'hero' && (
        <>
          <Hero onStart={() => setEstagio('qualificacao')} />
          <HowItWorks />
          <InstitutionalSection />
          <Footer />
        </>
      )}

      {estagio !== 'hero' && (
        <main className="flex-1 px-6 py-16 sm:py-24">
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
                calcularEIrParaContato()
              }}
            />
          )}

          {estagio === 'calculando' && (
            <LoadingCalculating onDone={() => setEstagio('contato')} />
          )}

          {estagio === 'contato' && resultado && (
            <ContactCapture
              economiaMensalPreview={resultado.economiaMensal}
              onSubmit={handleContactSubmit}
              submitting={enviando}
              erroSubmit={erroEnvio}
            />
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
