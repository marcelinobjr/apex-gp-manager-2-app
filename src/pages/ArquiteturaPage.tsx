import React from 'react'
import {
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Server,
  Code2,
  Workflow,
  Lock,
  GitBranch,
} from 'lucide-react'

export const ArquiteturaPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase bg-[#1E88E5]/20 text-[#64B5F6] px-2 py-0.5 rounded font-bold">
            ARQUITETURA DE SISTEMAS
          </span>
          <span className="text-[11px] font-mono text-gray-400">APEX GP MANAGER 2.0</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Arquitetura em 3 Camadas & Motor Desacoplado
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
          Definição das fronteiras de responsabilidade, modelo de execução determinística da
          corrida, garantias de integridade transacional e estratégia de governança via GitHub.
        </p>
      </div>

      {/* The 3-Tier Layer Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E88E5]" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#64B5F6] font-bold">CAMADA 1</span>
              <span className="text-[10px] font-mono bg-[#0F1115] px-1.5 py-0.5 rounded text-gray-400">
                Imutável
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Catálogo Mestre</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Repositório global e versionado contendo os dados canônicos: 33 equipes, 188 pilotos,
              11 motores, 6 managers, 9 instalações e 41 circuitos ativos.
            </p>
            <ul className="text-xs text-gray-400 space-y-1.5 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
                <span>teams, drivers, driver_attributes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
                <span>engines, managers, car_baselines</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
                <span>circuits (41 ativos, 2 inativos)</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#23272F] text-[11px] font-mono text-emerald-400">
            ✓ Nunca alterado pelo gameplay
          </div>
        </div>

        <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFB800]" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#FFB800] font-bold">CAMADA 2</span>
              <span className="text-[10px] font-mono bg-[#0F1115] px-1.5 py-0.5 rounded text-gray-400">
                Congelado no Setup
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Universo / Setup</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Configuração inicial escolhida para a carreira: modo Free ou Premium, equipes ativas,
              distribuição de pilotos, força técnica (50%–150%) e calendário.
            </p>
            <ul className="text-xs text-gray-400 space-y-1.5 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                <span>career_universes, initial_grid</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                <span>team_strength_pct (50-150%)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                <span>initial_ruleset, random_seed</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#23272F] text-[11px] font-mono text-amber-400">
            ✓ Congelado na criação da carreira
          </div>
        </div>

        <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E10600]" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#FF6B6B] font-bold">CAMADA 3</span>
              <span className="text-[10px] font-mono bg-[#0F1115] px-1.5 py-0.5 rounded text-gray-400">
                Dinâmico & Transacional
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Carreira / Temporada</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Estado dinâmico e vivo: 4 motores físicos por piloto, desgaste de peças, caixa/teto de
              gastos, projetos de P&D, moral, resultados de GP e histórico sucessivo.
            </p>
            <ul className="text-xs text-gray-400 space-y-1.5 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span>engine_units (4 por piloto)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span>championship_point_ledger</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span>season_transition_receipts</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#23272F] text-[11px] font-mono text-red-400">
            ✓ Auditável, imutável e idempotente
          </div>
        </div>
      </div>

      {/* Supabase vs Skip Cloud Evaluation */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Database size={16} className="text-[#00AF54]" />
          <span>Avaliação de Backend: Supabase vs. Skip Cloud (PocketBase)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#0F1115] p-4 rounded border border-[#23272F]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">
                Opção 1: Supabase (Recomendação do Usuário)
              </span>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded">
                Preferencial
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-3">
              PostgreSQL completo com suporte nativo a transações multi-tabela (
              <code className="text-gray-200">BEGIN ... COMMIT</code>), funções em SQL/PLpgSQL para
              o ledger de pontos atômico e row-level security (RLS) para isolamento estrito de
              carreiras.
            </p>
            <div className="space-y-1.5 text-gray-400 font-mono text-[11px]">
              <div>
                • <strong>Vantagens:</strong> ACID total, foreign keys relacionais estritas,
                auditoria nativa.
              </div>
              <div>
                • <strong>Condição de Ativação:</strong> Exige conector ativo ou credenciais
                configuradas na organização do proprietário.
              </div>
            </div>
          </div>

          <div className="bg-[#0F1115] p-4 rounded border border-[#23272F]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">
                Opção 2: Skip Cloud (PocketBase Integrado)
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">
                Ativo Nesta Sessão
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-3">
              SQLite embarcado com pb_hooks e migrações JS. Já provisionado neste projeto, suporta
              coleções, autenticação, realtime SSE e execução de rotinas atômicas via{' '}
              <code className="text-gray-200">app.runInTransaction(...)</code>.
            </p>
            <div className="space-y-1.5 text-gray-400 font-mono text-[11px]">
              <div>
                • <strong>Vantagens:</strong> Zero latência de rede externa, migrações versionadas
                no repositório.
              </div>
              <div>
                • <strong>Solução para Conciliação:</strong> Evitar concorrência de fontes usando um
                único banco como autoridade. Se Supabase for conectado na Fase 01, este assumirá
                100% dos dados.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deterministic Simulation Core Engine */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Cpu size={16} className="text-[#E10600]" />
          <span>Execução do Motor Esportivo: Limites & Determinismo</span>
        </h2>
        <div className="space-y-3 text-xs leading-relaxed text-gray-300">
          <p>
            O motor de corrida (RACE-ENGINE-01 a 05 + ENGINE-06) é um{' '}
            <strong>núcleo determinístico desacoplado</strong>. Uma corrida completa de Fórmula 1
            (50 a 78 voltas com 22 carros, resolução de disputas por setor e eventos de segurança)
            requer milhões de operações matemáticas e{' '}
            <strong>NÃO cabe no tempo de execução de uma única serverless function</strong>{' '}
            tradicional.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
              <div className="font-semibold text-white mb-1">1. Isolamento Lógico</div>
              <p className="text-gray-400 text-[11px]">
                O simulador recebe um <code className="text-gray-200">RaceScenario</code> (carros,
                pilotos, pneus, clima, seed) e roda em ciclos lógicos de 250ms (ticks), gerando
                eventos sequenciais verificáveis.
              </p>
            </div>
            <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
              <div className="font-semibold text-white mb-1">2. Execução Híbrida & Verificação</div>
              <p className="text-gray-400 text-[11px]">
                A simulação em tempo real pode avançar no cliente para velocidade visual (1x/4x/8x),
                enquanto o backend valida a integridade esportiva através de snapshots e hash de
                eventos imutáveis.
              </p>
            </div>
            <div className="bg-[#0F1115] p-3 rounded border border-[#23272F]">
              <div className="font-semibold text-white mb-1">3. Sem Confiança no Cliente</div>
              <p className="text-gray-400 text-[11px]">
                O navegador nunca envia valores finais de pontos, desgaste de motor ou saldo de
                dinheiro. O backend processa o fechamento do GP a partir do recibo oficial da
                sessão.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repository & Governance */}
      <div className="bg-[#161A21] border border-[#23272F] rounded-lg p-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <GitBranch size={16} className="text-[#1E88E5]" />
          <span>Estratégia de Repositório GitHub & Assets</span>
        </h2>
        <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-2">
              <p>
                O proprietário indicou o repositório de assets existente:{' '}
                <code className="text-[#00AF54] font-mono">
                  marcelinobjr/apex-gp-manager-2-assets
                </code>
                .
              </p>
              <p className="text-gray-400">
                Para o código-fonte da aplicação APEX 2.0, recomendamos a criação de um repositório
                exclusivo (ex:{' '}
                <code className="text-white font-mono">marcelinobjr/apex-gp-manager-2-app</code>),
                mantendo o isolamento absoluto entre binários de mídia (retratos, SVGs, áudios) e
                código com histórico git leve.
              </p>
              <div className="bg-[#0F1115] p-2.5 rounded border border-[#23272F] text-[11px] font-mono text-gray-400">
                <span>Estrutura proposta de branches: </span>
                <span className="text-emerald-400">main</span> (produção) ←{' '}
                <span className="text-blue-400">staging</span> (homologação) ←{' '}
                <span className="text-yellow-400">feature/*</span> (tarefas isoladas)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArquiteturaPage
