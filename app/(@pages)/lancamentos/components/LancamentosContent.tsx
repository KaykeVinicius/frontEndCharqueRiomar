"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useLancamentos } from "../hooks/useLancamentos";

export function LancamentosContent() {
  const {
    lancamentos,
    filteredLancamentos,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingLancamento,
    formData,
    setFormData,
    handleValorChange,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    setEditingLancamento,
    setores,
    categorias,
  } = useLancamentos();

  // 🔹 Função para formatar data sem problemas de fuso horário
  const formatarDataParaExibicao = (dataString: string) => {
    if (!dataString) return "N/A";
    
    // Divide a string YYYY-MM-DD e cria a data no fuso local
    const [year, month, day] = dataString.split('-');
    const data = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return data.toLocaleDateString("pt-BR");
  };

  // 🔹 Função para formatar valor como moeda brasileira
  const formatarValorParaExibicao = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 🔹 Função para calcular as datas permitidas
  const getDatasPermitidas = () => {
    const hoje = new Date();
    const duasDiasAtras = new Date();
    duasDiasAtras.setDate(hoje.getDate() - 2);
    
    return {
      dataMinima: duasDiasAtras.toISOString().split('T')[0], // 2 dias atrás
      dataMaxima: hoje.toISOString().split('T')[0] // hoje
    };
  };

  const { dataMinima, dataMaxima } = getDatasPermitidas();

  if (loading) return <p>Carregando lançamentos...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔹 Validação da data antes de enviar
    const dataSelecionada = new Date(formData.data + 'T00:00:00');
    const hoje = new Date();
    const duasDiasAtras = new Date();
    duasDiasAtras.setDate(hoje.getDate() - 2);
    
    // Remove horas para comparar apenas as datas
    hoje.setHours(0, 0, 0, 0);
    duasDiasAtras.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);
    
    if (dataSelecionada > hoje) {
      alert("❌ Não é permitido lançar em datas futuras!");
      return;
    }
    
    if (dataSelecionada < duasDiasAtras) {
      alert("❌ Só é permitido lançar até 2 dias antes da data atual!");
      return;
    }

    if (editingLancamento)
      await updateLancamento(editingLancamento.id, formData);
    else await createLancamento(formData);

    setFormData({ setorId: 0, categoriaId: 0, data: "", valor: "" });
    setEditingLancamento(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingLancamento(item);
    // 🔹 Formata o valor para Real ao editar
    const valorFormatado = (item.valor || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setFormData({
      setorId: item.setorId,
      categoriaId: item.categoriaId,
      data: item.data,
      valor: valorFormatado,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => deleteLancamento(id);

  return (
    <div className="space-y-6">
      {/* Header + Botão */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os lançamentos do sistema
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                setFormData({ setorId: 0, categoriaId: 0, data: "", valor: "" })
              }
            >
              <Plus className="mr-2 h-4 w-4"/> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Setor */}
                <div className="grid gap-2">
                  <label htmlFor="setorId">Setor</label>
                  <select
                    id="setorId"
                    value={formData.setorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        setorId: Number(e.target.value),
                      })
                    }
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="0">Selecione um setor</option>
                    {setores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoria */}
                <div className="grid gap-2">
                  <label htmlFor="categoriaId">Categoria</label>
                  <select
                    id="categoriaId"
                    value={formData.categoriaId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoriaId: Number(e.target.value),
                      })
                    }
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="0">Selecione uma categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div className="grid gap-2">
                  <label htmlFor="data">Data</label>
                  <Input
                    type="date"
                    id="data"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    min={dataMinima}
                    max={dataMaxima}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Permitido apenas lançamentos de {formatarDataParaExibicao(dataMinima)} até {formatarDataParaExibicao(dataMaxima)}
                  </p>
                </div>

                {/* Valor */}
                <div className="grid gap-2">
                  <label htmlFor="valor">Valor (R$)</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    id="valor"
                    value={formData.valor}
                    onChange={(e) => handleValorChange(e.target.value)}
                    placeholder="0,00"
                    required
                    className="text-right"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editingLancamento ? "Salvar Alterações" : "Criar Lançamento"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lançamentos</CardTitle>
          <CardDescription>
            {filteredLancamentos.length} lançamento(s) cadastrado(s)
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por valor."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLancamentos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.setor?.nome || "N/A"}</TableCell>
                  <TableCell>{item.categoria?.nome || "N/A"}</TableCell>
                  <TableCell>
                    {formatarDataParaExibicao(item.data)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatarValorParaExibicao(Number(item.valor || 0))}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}