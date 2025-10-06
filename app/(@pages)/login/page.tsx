"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CharqueRiomarLogo } from "@/components/charque-riomar-logo"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{0,3})/, "$1.$2")
  if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3")
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4")
}

const validateCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, "")
  if (numbers.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numbers)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(numbers[i]) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number(numbers[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(numbers[i]) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number(numbers[10])) return false

  return true
}

export default function LoginPage() {
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Remove formatação para validação
    const cpfNumbers = cpf.replace(/\D/g, "")
    
    if (!validateCPF(cpfNumbers)) {
      setError("CPF inválido")
      return
    }

    try {
      // ✅ ENVIA CPF SEM PONTOS para o backend
      await login(cpfNumbers, password)
      router.push("/")
    } catch (err: any) {
      console.error("💥 Erro capturado no componente:", err)
      setError(err?.message || "CPF ou senha inválidos")
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) setCpf(formatCPF(numbers))
  }

  // Função de teste direto no botão (remova depois que funcionar)
  const handleTestLogin = async () => {
    const cpfNumbers = cpf.replace(/\D/g, "")
    
    if (!validateCPF(cpfNumbers)) {
      setError("CPF inválido")
      return
    }

    try {
      await login(cpfNumbers, password)
      router.push("/")
    } catch (err: any) {
      console.error("❌ Erro:", err)
      setError(err?.message || "CPF ou senha inválidos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <CharqueRiomarLogo size="xl" className="drop-shadow-lg" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">Sistema de Controle Financeiro</CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* FORM ORIGINAL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                required
                disabled={loading}
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* BOTÃO DE TESTE (REMOVA DEPOIS QUE FUNCIONAR) */}
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={handleTestLogin}
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                "Testar Login (Debug)"
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Esqueceu sua senha?{" "}
              <a href="/forgot-password" className="text-red-600 hover:text-red-700 font-medium">
                Clique aqui
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}