"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CharqueRiomarLogo } from "@/components/charque-riomar-logo";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { email } }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao enviar email de recuperação");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CharqueRiomarLogo size="lg" className="drop-shadow-lg" />
            </div>
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Email Enviado!
              </CardTitle>
              <CardDescription className="text-slate-600">
                Verifique sua caixa de entrada para instruções de recuperação de
                senha
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <CharqueRiomarLogo size="lg" className="drop-shadow-lg" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Recuperar Senha
            </CardTitle>
            <CardDescription className="text-slate-600">
              Digite seu email cadastrado para receber instruções de recuperação
              de senha
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Email de Recuperação"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="inline mr-1 h-4 w-4" />
              Voltar ao Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
