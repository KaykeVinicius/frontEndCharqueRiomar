"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, Database, Shield } from "lucide-react"

export function ConfiguracoesContent() {
  const [configuracoes, setConfiguracoes] = useState({
    empresa: {
      nome: "Charque Riomar",
      cnpj: "12.345.678/0001-90",
      endereco: "Rua das Indústrias, 123",
      cidade: "Rio Grande",
      estado: "RS",
      cep: "96200-000",
      telefone: "(53) 3233-4567",
      email: "contato@charqueriomar.com",
    },
    sistema: {
      notificacoesPorEmail: true,
      backupAutomatico: true,
      logAuditoria: true,
      sessaoExpira: "8",
      moedaPadrao: "BRL",
    },
    integracao: {
      apiRails: "http://localhost:3000/api",
      timeoutRequisicao: "30",
      tentativasReconexao: "3",
    },
  })

  const handleSave = () => {
    // Aqui você salvaria as configurações
    console.log("Configurações salvas:", configuracoes)
  }

  const updateEmpresa = (field: string, value: string) => {
    setConfiguracoes((prev) => ({
      ...prev,
      empresa: { ...prev.empresa, [field]: value },
    }))
  }

  const updateSistema = (field: string, value: string | boolean) => {
    setConfiguracoes((prev) => ({
      ...prev,
      sistema: { ...prev.sistema, [field]: value },
    }))
  }

  const updateIntegracao = (field: string, value: string) => {
    setConfiguracoes((prev) => ({
      ...prev,
      integracao: { ...prev.integracao, [field]: value },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>Informações básicas da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  value={configuracoes.empresa.nome}
                  onChange={(e) => updateEmpresa("nome", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={configuracoes.empresa.cnpj}
                  onChange={(e) => updateEmpresa("cnpj", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={configuracoes.empresa.endereco}
                  onChange={(e) => updateEmpresa("endereco", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={configuracoes.empresa.cidade}
                  onChange={(e) => updateEmpresa("cidade", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={configuracoes.empresa.estado}
                  onChange={(e) => updateEmpresa("estado", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={configuracoes.empresa.cep}
                  onChange={(e) => updateEmpresa("cep", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={configuracoes.empresa.telefone}
                  onChange={(e) => updateEmpresa("telefone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={configuracoes.empresa.email}
                  onChange={(e) => updateEmpresa("email", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sistema
            </CardTitle>
            <CardDescription>Configurações gerais do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">Receber notificações importantes por e-mail</p>
              </div>
              <Switch
                checked={configuracoes.sistema.notificacoesPorEmail}
                onCheckedChange={(checked) => updateSistema("notificacoesPorEmail", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Automático</Label>
                <p className="text-sm text-muted-foreground">Realizar backup automático dos dados</p>
              </div>
              <Switch
                checked={configuracoes.sistema.backupAutomatico}
                onCheckedChange={(checked) => updateSistema("backupAutomatico", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Log de Auditoria</Label>
                <p className="text-sm text-muted-foreground">Manter registro de todas as ações dos usuários</p>
              </div>
              <Switch
                checked={configuracoes.sistema.logAuditoria}
                onCheckedChange={(checked) => updateSistema("logAuditoria", checked)}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessao">Sessão Expira (horas)</Label>
                <Input
                  id="sessao"
                  type="number"
                  value={configuracoes.sistema.sessaoExpira}
                  onChange={(e) => updateSistema("sessaoExpira", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moeda">Moeda Padrão</Label>
                <Input
                  id="moeda"
                  value={configuracoes.sistema.moedaPadrao}
                  onChange={(e) => updateSistema("moedaPadrao", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integração com Rails */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Integração Rails API
            </CardTitle>
            <CardDescription>Configurações de conexão com o backend Rails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL da API Rails</Label>
              <Input
                id="apiUrl"
                value={configuracoes.integracao.apiRails}
                onChange={(e) => updateIntegracao("apiRails", e.target.value)}
                placeholder="http://localhost:3000/api"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (segundos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={configuracoes.integracao.timeoutRequisicao}
                  onChange={(e) => updateIntegracao("timeoutRequisicao", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tentativas">Tentativas de Reconexão</Label>
                <Input
                  id="tentativas"
                  type="number"
                  value={configuracoes.integracao.tentativasReconexao}
                  onChange={(e) => updateIntegracao("tentativasReconexao", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="text-green-600">
                <Database className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
              <span className="text-sm text-muted-foreground">Última sincronização: há 2 minutos</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
