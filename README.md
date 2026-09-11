# Solarium Energy — Diagnóstico de Economia com Energia Solar Industrial

Landing page com formulário multi-etapa e diagnóstico automático de economia
com energia solar, exclusiva para indústrias de Santa Catarina. Inclui um
painel interno (mock de CRM) para visualizar os leads recebidos — esta é uma
versão de demonstração, sem integração com CRM externo.

**Produção:** https://wonzimkt.github.io/solarium-energy-diagnostico/
**Painel interno:** https://wonzimkt.github.io/solarium-energy-diagnostico/painel

## Stack

- React + TypeScript + Vite + Tailwind CSS
- Supabase (Postgres + Edge Functions) para persistência dos leads
- jsPDF para geração do relatório em PDF
- Deploy automático via GitHub Actions → GitHub Pages

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com as credenciais do Supabase
npm run dev
```

## Testes

```bash
npm run test
```

Cobre os 3 cenários de referência do motor de cálculo (indústria pequena/1
turno, média/2 turnos, grande/3 turnos com área de telhado limitante) e o
alerta de tarifa fora da faixa plausível.

## Motor de cálculo

Toda a lógica de dimensionamento, tarifa efetiva, regra do Fio B (Lei
14.300/2022), payback e economia acumulada está em
[`src/lib/calculations.ts`](src/lib/calculations.ts), com as premissas de
mercado centralizadas em [`src/lib/constants.ts`](src/lib/constants.ts) —
atualize essas constantes conforme novos dados de tarifa, cronograma do Fio B
ou custo de mercado por kWp forem publicados.

## Painel interno

Login fixo de demonstração (usuário/senha), configurado como secret no GitHub
Actions e nas variáveis de ambiente locais. Os leads são lidos por uma Edge
Function do Supabase (`supabase/functions/panel-leads`) que confere a senha e
usa a service role apenas no servidor — a chave pública do front-end nunca
tem permissão de leitura direta da tabela `leads`.

## Pendências antes de uma demonstração real

- **Número de WhatsApp**: o CTA final em [`ResultDashboard.tsx`](src/components/ResultDashboard.tsx)
  usa um número de placeholder (`5549999999999`) — trocar pelo WhatsApp real
  da Solarium Energy antes de qualquer demonstração a um cliente.
- **Leads de teste**: os leads usados para validar o motor de cálculo durante
  o QA (Têxtil Chapecó Ltda, Grande Indústria Metalúrgica S.A.) estão no
  banco de produção — remova-os antes de mostrar o painel a um cliente, se
  preferir uma lista limpa.
- **Constantes de mercado** (seção 9 do briefing): tarifa, cronograma do Fio
  B e custo por kWp mudam com frequência — revisar antes do lançamento real.
