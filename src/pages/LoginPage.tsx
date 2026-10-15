import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('m.blasques@multi.br.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError('Credenciais inválidas. Use o usuário proprietário pré-configurado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161A21] border border-[#23272F] rounded-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E10600]" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded bg-[#E10600] flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(225,6,0,0.4)]">
            AX
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              APEX GP Manager 2.0
            </h1>
            <p className="text-xs text-gray-400 font-mono">Console de Diagnóstico • BOOTSTRAP-00</p>
          </div>
        </div>

        <div className="bg-[#0F1115] border border-[#23272F] rounded p-3 mb-6 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#FFB800] font-semibold">
            <ShieldCheck size={14} />
            <span>Acesso Restrito ao Proprietário</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Ambiente reservado para avaliação técnica, conferência de arquivos e aprovação do plano
            de construção do APEX 2.0.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-200 p-3 rounded mb-4 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              E-mail do Proprietário
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0F1115] border border-[#23272F] rounded px-3 py-2 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
                placeholder="m.blasques@multi.br.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0F1115] border border-[#23272F] rounded px-3 py-2 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E10600] hover:bg-[#C00500] text-white font-semibold py-2.5 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(225,6,0,0.3)]"
          >
            <span>{loading ? 'Verificando...' : 'Entrar no Console'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#23272F] text-center text-[11px] font-mono text-gray-500">
          Credencial pré-configurada: <code className="text-gray-400">m.blasques@multi.br.com</code>{' '}
          / <code className="text-gray-400">Skip@Pass</code>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
