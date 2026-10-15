import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileCheck2,
  AlertTriangle,
  Database,
  BarChart3,
  CheckCircle2,
  Layers,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Building,
  Flag,
  Car,
  Users,
  Compass,
} from 'lucide-react'

export const VisaoGeralPage: React.FC = () => {
  const [filterPending, setFilterPending] = useState<string>('TODAS')

  const catalogStats = [
    { label: 'Equipes', value: 33, note: 'team_0001 a 0033', icon: Building },
    { label: 'Pilotos Nomeados', value: 188, note: '14 atributos + personalidade', icon: Users },
    { label: 'Retratos (Portraits)', value: 255, note: '188 nomeados + 67 genéricos', icon: Users },
    { label: 'Motores (Engines)', value: 11, note: 'ENG-0001 a 0011', icon: Car },
    { label: 'Managers', value: 6, note: '6 arquétipos / 24 modificadores', icon: Compass },
    {
      label: 'Instalações / Equipe',
      value: 9,
      note: 'Níveis 1–5 com efeito causal',
      icon: Building,
    },
    { label: 'Circuitos Ativos', value: 41, note: 'N2 mapeado / 2 inativos mantidos', icon: Flag },
    {
      label: 'Atributos Chassi',
      value: 8,
      note: 'Notas 1–100 independentes de motor',
      icon: Layers,
    },
  ]

  const pendingDecisions = [
    {
      id: 'DEC-01',
      topic: 'Teto de Gastos Inicial e Exclusões',
      priority: 'P0',
      description:
        'Valor base do cost cap para a 1ª temporada e detalhamento das categorias excluídas (salários de pilotos, marketing, motores).',
      defaultProp:
        'Teto base de $140M/ano; salários de pilotos e top 3 executivos excluídos do cap mas limitados pelo caixa da equipe.',
    },
    {
      id: 'DEC-02',
      topic: 'Piso Mínimo de Caixa (Anti-Falência)',
      priority: 'P0',
      description:
        'Definição do piso de liquidez obrigatório e política transparente de readequação de custos sem injeção de dinheiro mágico.',
      defaultProp:
        'Piso de segurança de $5M; se headroom projetado for negativo, bloqueia novos contratos e aciona plano de corte proporcional.',
    },
    {
      id: 'DEC-03',
      topic: 'Penalização da 5ª Unidade de Motor',
      priority: 'P0',
      description:
        'Definição exata da perda de posições de grid no primeiro uso do 5º motor (e unidades subsequentes) por piloto.',
      defaultProp:
        'Perda de 10 posições no grid para a 5ª unidade nova; 5 posições para 6ª em diante. Troca para unidade 1-4 usada não penaliza.',
    },
    {
      id: 'DEC-04',
      topic: 'Regulamento de Pontuação GP e Sprint',
      priority: 'P0',
      description:
        'Tabela oficial de pontuação (F1 padrão: 25-18-15... vs variações históricas) e critérios de desempate.',
      defaultProp:
        'Padrão 2026: GP (25, 18, 15, 12, 10, 8, 6, 4, 2, 1) + 1 ponto volta mais rápida (se top 10); Sprint (8, 7, 6, 5, 4, 3, 2, 1).',
    },
    {
      id: 'DEC-05',
      topic: 'Circuit Profiles e Pit-Loss dos 41 Ativos',
      priority: 'P1',
      description:
        'Consolidar 17 valores de pit-loss e 9 tempos-base ausentes na transição do pacote 03B para 41 ativos.',
      defaultProp:
        'Adotar médias dos 24 circuitos contemporâneos para os 17 pendentes e gerar arquivo versionado circuit_profiles.csv no Lote 02.',
    },
    {
      id: 'DEC-06',
      topic: 'Controle Percentual no Modo Free vs Premium',
      priority: 'P1',
      description:
        'Definir se o ajuste de força 50%-150% das equipes é exclusivo do modo Premium ou se Free tem presets fechados.',
      defaultProp:
        'Free utiliza 100% fixo (baseline canônica); Premium desbloqueia editor 50%-150% com passo de 5%.',
    },
  ]

  const filteredDecisions =
    filterPending === 'TODAS'
      ? pendingDecisions
      : pendingDecisions.filter((d) => d.priority === filterPending)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#E10600]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase bg-[#E10600]/20 text-[#FF6B6B] px-2 py-0.5 rounded font-bold">
                FASE 00 • BOOTSTRAP
              </span>
              <span className="text-[11px] font-mono text-gray-400">LOTE 00 CONFERIDO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Visão Geral do Diagnóstico & Arquitetura
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Consolidação de requisitos, verificação de ambiente isolado e plano de execução para a
              reconstrução independente do{' '}
              <strong className="text-white">APEX GP Manager 2.0</strong>, baseada no Documento
              Mestre v2.2.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/bootstrap/proxima-tarefa"
              className="bg-[#E10600] hover:bg-[#C00500] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-colors shadow-[0_0_12px_rgba(225,6,0,0.3)]"
            >
              <span>Avaliar e Aprovar</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation of Document Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#00AF54]/10 border border-[#00AF54]/30 flex items-center justify-center text-[#00AF54]">
                <FileCheck2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Documento Mestre Consolidado</h3>
                <span className="text-[11px] font-mono text-gray-400">
                  v2.2 • 15 Outubro 2026 • 50 páginas
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#00AF54]/20 text-[#00AF54] px-2 py-0.5 rounded font-semibold">
              LIDO INTEGRALMENTE
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-3 leading-relaxed">
            Leitura completa dos capítulos 01 a 13 e apêndices A, B e C. Abrange arquitetura em 3
            camadas, regras do motor RACE-ENGINE-01–05, ENGINE-06, rádio exclusivo da equipe humana,
            4 motores por piloto, teto de gastos e invariantes INV-01 a INV-08.
          </p>
          <div className="mt-3 pt-3 border-t border-[#23272F] flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Páginas: 1 a 50 (50/50 lidas)</span>
            <span className="text-emerald-400">0 páginas inacessíveis</span>
          </div>
        </div>

        <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#00AF54]/10 border border-[#00AF54]/30 flex items-center justify-center text-[#00AF54]">
                <FileCheck2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Manifesto de Entregas Skip</h3>
                <span className="text-[11px] font-mono text-gray-400">
                  v1.0 • 15 Outubro 2026 • Lotes 00 a 04+
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#00AF54]/20 text-[#00AF54] px-2 py-0.5 rounded font-semibold">
              LIDO INTEGRALMENTE
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-3 leading-relaxed">
            Regra operacional de no máximo <strong>3 anexos por envio</strong> absorvida no
            planejamento. Diretrizes para lotes de Catálogos (01), Circuitos 41 ativos (02),
            Mídias/Assets (03) e Refinamentos (04+) incorporadas na esteira.
          </p>
          <div className="mt-3 pt-3 border-t border-[#23272F] flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Protocolo: BOOTSTRAP-00</span>
            <span className="text-emerald-400">Regra de lote confirmada</span>
          </div>
        </div>
      </div>

      {/* Integration Verification Card */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-[#00AF54]" />
          <span>Ambiente & Integrações Verificadas (Modo Consulta)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
            <div className="text-gray-400 font-mono text-[10px] uppercase">Projeto Skip Atual</div>
            <div className="font-semibold text-white mt-1">APEX GP Manager 2.0</div>
            <div className="text-gray-400 text-[11px] font-mono mt-0.5">
              Template React+Vite+TS+Tailwind
            </div>
          </div>
          <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
            <div className="text-gray-400 font-mono text-[10px] uppercase">
              Repositório de Assets
            </div>
            <div className="font-semibold text-[#00AF54] mt-1 font-mono">
              marcelinobjr/apex-gp-manager-2-assets
            </div>
            <div className="text-gray-400 text-[11px] mt-0.5">
              Vínculo informado pelo proprietário
            </div>
          </div>
          <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
            <div className="text-gray-400 font-mono text-[10px] uppercase">
              Banco de Dados Ativo
            </div>
            <div className="font-semibold text-white mt-1">Skip Cloud (PocketBase)</div>
            <div className="text-gray-400 text-[11px] mt-0.5">
              Migrações JS em pocketbase/migrations
            </div>
          </div>
          <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
            <div className="text-gray-400 font-mono text-[10px] uppercase">
              Separação do APEX 1.0
            </div>
            <div className="font-semibold text-[#00AF54] mt-1">100% Isolado</div>
            <div className="text-gray-400 text-[11px] mt-0.5">
              Sem herança de banco ou chaves legadas
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Metric Reference Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-[#E10600]" />
            <span>Dimensões do Catálogo Mestre (Referências Planejadas)</span>
          </h2>
          <span className="text-[11px] text-gray-400 font-mono">
            *Dados de dimensionamento do Documento Mestre — não são registros inseridos
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {catalogStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="bg-[#161A21] border border-[#23272F] rounded-lg p-3.5 hover:border-[#323846] transition-all"
              >
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-medium">{stat.label}</span>
                  <Icon size={14} />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-1">{stat.value}</div>
                <div
                  className="text-[10px] font-mono text-gray-400 mt-1 truncate"
                  title={stat.note}
                >
                  {stat.note}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending Decisions Table */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#FFB800]" />
              <span>Decisões de Calibração Pendentes (Capítulo 13.16)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Itens do documento que exigem parametrização prévia antes de virar código nos módulos
              esportivos e financeiros.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0F1115] p-1 rounded border border-[#23272F]">
            {['TODAS', 'P0', 'P1'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPending(p)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                  filterPending === p
                    ? 'bg-[#E10600] text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#23272F] text-gray-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">ID / Prioridade</th>
                <th className="py-2.5 px-3">Tema</th>
                <th className="py-2.5 px-3">Descrição da Pendência</th>
                <th className="py-2.5 px-3">Proposta Sugerida para Aprovação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23272F]/60">
              {filteredDecisions.map((dec) => (
                <tr key={dec.id} className="hover:bg-[#1C212A] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold whitespace-nowrap">
                    <span className="text-white mr-2">{dec.id}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        dec.priority === 'P0'
                          ? 'bg-[#E10600]/20 text-[#FF6B6B]'
                          : 'bg-[#FFB800]/20 text-[#FFB800]'
                      }`}
                    >
                      {dec.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {dec.topic}
                  </td>
                  <td className="py-3 px-3 text-gray-300 leading-relaxed max-w-sm">
                    {dec.description}
                  </td>
                  <td className="py-3 px-3 text-emerald-400/90 leading-relaxed max-w-md font-mono text-[11px]">
                    {dec.defaultProp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VisaoGeralPage
