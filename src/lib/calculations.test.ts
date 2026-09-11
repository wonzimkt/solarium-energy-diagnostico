import { describe, expect, it } from 'vitest'
import { calcularDiagnostico } from './calculations'

describe('calcularDiagnostico', () => {
  it('cenário 1 — indústria pequena, 1 turno, Oeste (Chapecó), sem área informada', () => {
    const r = calcularDiagnostico({
      consumoMedioKwh: 8000,
      valorMedioConta: 6800,
      regiao: 'oeste',
      regime: 'turno_1',
      areaDisponivelM2: null,
    })

    expect(r.tarifaEfetiva).toBeCloseTo(0.85, 3)
    expect(r.tarifaForaDaFaixa).toBe(false)
    expect(r.kwpNecessario).toBeCloseTo(72.7273, 3)
    expect(r.limitadoPorArea).toBe(false)
    expect(r.energiaGeradaMensalKwh).toBeCloseTo(8000, 0)
    expect(r.economiaMensal).toBeCloseTo(6310.4, 1)
    expect(r.percentualEconomia).toBeCloseTo(6310.4 / 6800, 4)
    expect(r.investimentoEstimado).toBeCloseTo(130909.09, 1)
    expect(r.paybackMeses).toBeCloseTo(20.745, 2)
    expect(r.economiaAcumulada25Anos).toBeCloseTo(1893120, 0)
    // o comparativo de rendimento (juros compostos) deve superar a soma simples
    expect(r.economiaInvestidaCDI25Anos).toBeGreaterThan(r.economiaAcumulada25Anos)
    expect(r.co2EvitadoTonAno).toBeCloseTo(4.8, 3)
  })

  it('cenário 2 — indústria média, 2 turnos, Litoral/Serra/Meio-Oeste (Joinville), sem área informada', () => {
    const r = calcularDiagnostico({
      consumoMedioKwh: 40000,
      valorMedioConta: 32000,
      regiao: 'litoral_serra_meio_oeste',
      regime: 'turno_2',
      areaDisponivelM2: null,
    })

    const tarifaEsperada = 32000 / 40000 // 0.8
    expect(r.tarifaEfetiva).toBeCloseTo(tarifaEsperada, 4)
    expect(r.tarifaForaDaFaixa).toBe(false)

    const kwpEsperado = (40000 * 12) / 1250
    expect(r.kwpNecessario).toBeCloseTo(kwpEsperado, 3)
    expect(r.limitadoPorArea).toBe(false)

    const geracaoEsperada = (kwpEsperado * 1250) / 12
    expect(r.energiaGeradaMensalKwh).toBeCloseTo(geracaoEsperada, 1)

    const autoconsumida = geracaoEsperada * 0.8
    const injetada = geracaoEsperada * 0.2
    const tarifaLiquida = tarifaEsperada - tarifaEsperada * 0.3 * 0.6
    const economiaEsperada = autoconsumida * tarifaEsperada + injetada * tarifaLiquida
    expect(r.economiaMensal).toBeCloseTo(economiaEsperada, 1)

    // sistema de porte 384 kWp cai na faixa 150kWp–1MWp => R$1500/kWp
    expect(kwpEsperado).toBeGreaterThan(150)
    expect(r.investimentoEstimado).toBeCloseTo(kwpEsperado * 1500, 1)
  })

  it('cenário 3 — indústria grande, 3 turnos, Vale/Sul (Blumenau), área de telhado menor que a necessária', () => {
    const r = calcularDiagnostico({
      consumoMedioKwh: 120000,
      valorMedioConta: 90000,
      regiao: 'vale_sul',
      regime: 'turno_3',
      areaDisponivelM2: 3000, // insuficiente de propósito
    })

    const kwpNecessarioEsperado = (120000 * 12) / 1180
    const areaNecessariaEsperada = kwpNecessarioEsperado * 6
    expect(r.kwpNecessario).toBeCloseTo(kwpNecessarioEsperado, 2)
    expect(areaNecessariaEsperada).toBeGreaterThan(3000)

    expect(r.limitadoPorArea).toBe(true)
    const kwpInstalavelEsperado = 3000 / 6
    expect(r.kwpInstalavel).toBeCloseTo(kwpInstalavelEsperado, 3)
    expect(r.fatorAutoconsumo).toBeCloseTo(0.92, 3)

    // sistema de 500 kWp instalável cai na faixa 150kWp–1MWp => R$1500/kWp
    expect(r.investimentoEstimado).toBeCloseTo(kwpInstalavelEsperado * 1500, 1)
  })

  it('sinaliza tarifa fora da faixa plausível quando os valores digitados são inconsistentes', () => {
    const rBaixa = calcularDiagnostico({
      consumoMedioKwh: 10000,
      valorMedioConta: 2000, // tarifa = 0.20 R$/kWh — abaixo do mínimo
      regiao: 'oeste',
      regime: 'turno_1',
      areaDisponivelM2: null,
    })
    expect(rBaixa.tarifaForaDaFaixa).toBe(true)

    const rAlta = calcularDiagnostico({
      consumoMedioKwh: 10000,
      valorMedioConta: 15000, // tarifa = 1.50 R$/kWh — acima do máximo
      regiao: 'oeste',
      regime: 'turno_1',
      areaDisponivelM2: null,
    })
    expect(rAlta.tarifaForaDaFaixa).toBe(true)
  })
})
