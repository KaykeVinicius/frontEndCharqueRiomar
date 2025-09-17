"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CharqueRiomarLogo } from "@/components/charque-riomar-logo"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "")
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

const validateCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, "")
  if (numbers.length !== 11) return false

  // Check for repeated digits
  if (/^(\d)\1{10}$/.test(numbers)) return false

  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(numbers[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numbers[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(numbers[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numbers[10])) return false

  return true
}

export default function LoginPage() {
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateCPF(cpf)) {
      setError("CPF inválido")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            cpf: cpf.replace(/\D/g, ""), // Send only numbers
            password,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Salvar token no localStorage ou cookie
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "CPF ou senha inválidos")
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      setCpf(formatCPF(numbers))
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
                disabled={isLoading}
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
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

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
