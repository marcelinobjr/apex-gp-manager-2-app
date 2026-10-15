import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Cpu,
  Database,
  CalendarCheck,
  FolderArchive,
  HelpCircle,
  ArrowRightCircle,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

import { Outlet } from 'react-router-dom'

interface LayoutProps {
  children?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    {
      title: 'Visão Geral',
      path: '/bootstrap/visao-geral',
      icon: LayoutDashboard,
      badge: 'Lote 00',
    },
    {
      title: 'Arquitetura',
      path: '/bootstrap/arquitetura',
      icon: Cpu,
      badge: '3 Camadas',
    },
    {
      title: 'Modelo Conceitual',
      path: '/bootstrap/modelo-conceitual',
      icon: Database,
      badge: '8 Invariantes',
    },
    {
      title: 'Plano de Construção',
      path: '/bootstrap/plano-construcao',
      icon: CalendarCheck,
      badge: 'Fases 00–08',
    },
    {
      title: 'Controle de Arquivos',
      path: '/bootstrap/controle-arquivos',
      icon: FolderArchive,
      badge: 'Max 3/Envio',
    },
    {
      title: 'Decisões Pendentes',
      path: '/bootstrap/decisoes',
      icon: HelpCircle,
      badge: 'Cap. 13.16',
    },
    {
      title: 'Próxima Tarefa',
      path: '/bootstrap/proxima-tarefa',
      icon: ArrowRightCircle,
      badge: 'FOUNDATION-01',
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#ECEFF4] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-[#23272F] bg-[#161A21] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#23272F]"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/bootstrap/visao-geral" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-[#E10600] flex items-center justify-center font-black tracking-wider text-white text-sm shadow-[0_0_12px_rgba(225,6,0,0.5)]">
              AX
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-sm sm:text-base leading-none">
                APEX <span className="text-[#E10600] font-mono text-xs sm:text-sm">GP 2.0</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-wide font-mono leading-none mt-0.5">
                CONSOLE TÉCNICO • BOOTSTRAP-00
              </span>
            </div>
          </Link>
        </div>

        {/* Status badges and user */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0F1115] border border-[#23272F] px-2.5 py-1 rounded text-gray-300 font-mono text-[11px]">
            <Server size={13} className="text-[#00AF54]" />
            <span>Sandbox Isolado</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-[#E10600]/10 border border-[#E10600]/30 px-2.5 py-1 rounded text-[#FF6B6B] font-mono text-[11px]">
            <ShieldAlert size={13} className="text-[#E10600]" />
            <span>Sem Código em Produção</span>
          </div>

          <div className="flex items-center gap-2 border-l border-[#23272F] pl-3 ml-1">
            <div className="text-right hidden sm:block">
              <div className="font-medium text-white text-xs leading-none">
                {user?.name || 'Marcelino Blasques'}
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5 leading-none">
                Proprietário
              </div>
            </div>
            <button
              onClick={logout}
              title="Encerrar sessão"
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#23272F] transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#23272F] bg-[#161A21] shrink-0">
          <div className="p-3 border-b border-[#23272F]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 px-2 py-1">
              Documentos & Diagnóstico
            </div>
          </div>
          <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const active = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-all ${
                    active
                      ? 'bg-[#E10600]/15 text-white font-semibold border-l-2 border-[#E10600]'
                      : 'text-gray-300 hover:text-white hover:bg-[#1C212A]'
                  } ${item.highlight && !active ? 'border border-[#E10600]/30 text-white' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-[#E10600]' : 'text-gray-400'} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        active ? 'bg-[#E10600] text-white' : 'bg-[#23272F] text-gray-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="p-3 border-t border-[#23272F] text-[11px] font-mono text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Doc. Mestre:</span>
              <span className="text-white">v2.2</span>
            </div>
            <div className="flex justify-between">
              <span>Manifesto:</span>
              <span className="text-white">v1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Fase Atual:</span>
              <span className="text-[#00AF54] font-bold">BOOTSTRAP-00</span>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/60 flex">
            <div className="w-72 bg-[#161A21] border-r border-[#23272F] h-full flex flex-col p-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#23272F]">
                <span className="font-bold text-white text-sm">Navegação BOOTSTRAP-00</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="py-3 space-y-1 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const active = location.pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded text-xs ${
                        active
                          ? 'bg-[#E10600]/20 text-white font-semibold'
                          : 'text-gray-300 hover:bg-[#1C212A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-[#23272F] px-1.5 py-0.5 rounded text-gray-400">
                        {item.badge}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#23272F] bg-[#161A21] py-2 px-4 text-center text-xs text-gray-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-1">
        <div>
          APEX GP Manager 2.0 • BOOTSTRAP-00 (Documento Técnico e Diagnóstico — Não é Implementação)
        </div>
        <div>Responsável: MBJ • 15 Outubro 2026 • Lote 00</div>
      </footer>
    </div>
  )
}

export default Layout
