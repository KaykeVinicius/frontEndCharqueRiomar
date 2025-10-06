"use client";
import { useState } from "react";
import { api } from "@/lib/api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    cpf: string;
    role: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(cpf: string, password: string) {
    setLoading(true);
    try {
      // ✅ CORREÇÃO: Enviar no formato que o Rails espera
      const response = await api.post<LoginResponse>("/login", {
        user: {
          cpf: cpf,
          password: password
        }
      });

      // ✅ Salvar token e usuário
      localStorage.setItem("token", response.token);
      setUser(response.user);
      
      return response;
    } catch (error: any) {
      // ✅ Melhor tratamento de erro
      let errorMessage = "Erro ao fazer login";
      
      if (error?.message?.includes("401")) {
        errorMessage = "CPF ou senha inválidos";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return { user, loading, login, logout };
}