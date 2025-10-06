"use client";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { Loader2 } from "lucide-react";

export default function AuthProtected({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { loading } = useCheckAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="text-lg text-slate-700">Carregando...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}