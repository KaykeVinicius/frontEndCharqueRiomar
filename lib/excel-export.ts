import * as XLSX from "xlsx"

export interface LancamentoExport {
  id?: string
  setor?: { nome: string }
  categoria?: { nome: string }
  data: string
  valor: number
}

export const exportToExcel = (lancamentos: LancamentoExport[]) => {
  if (lancamentos.length === 0) {
    alert("Não há dados para exportar.")
    return
  }

  try {
    // Ordenar lançamentos por data
    const lancamentosOrdenados = [...lancamentos].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    )

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([])

    // Cabeçalho Institucional
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["BIG CHARQUE INDUSTRIA E COMERCIO LTDA", "", "", "", "RELATÓRIO DE LANÇAMENTOS"],
      ["CNPJ: 05.434.424/0001-88", "", "", "", ""],
      ["Rua Pedro Spagnol, 4234 - Teixeirão", "", "", "", ""],
      ["Cacoal - RO | CEP: 76965-598", "", "", "", ""],
      ["Telefone: (69) 3443-2920", "", "", "", ""],
      ["E-mail: comercial@charqueriomar.com.br", "", "", "", ""],
      [], // linha em branco
      ["EMITIDO EM:", new Date().toLocaleDateString("pt-BR"), "", "Total de lançamentos:", lancamentos.length],
      [], // linha em branco
    ], { origin: "A1" })

    // Cabeçalho da tabela
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["SETOR", "CATEGORIA", "DATA", "VALOR (R$)"]
    ], { origin: "A10" })

    // Dados dos lançamentos - manter valores como números
    const startDataRow = 11;
    lancamentosOrdenados.forEach((lancamento, index) => {
      const row = startDataRow + index;
      XLSX.utils.sheet_add_aoa(worksheet, [
        [
          lancamento.setor?.nome || "N/A",
          lancamento.categoria?.nome || "N/A", 
          new Date(lancamento.data).toLocaleDateString("pt-BR"),
          Number(lancamento.valor || 0) // MANTER COMO NÚMERO
        ]
      ], { origin: `A${row}` });
    });

    // Linha do total - USAR FÓRMULA EXCEL PARA SOMAR
    const totalRow = startDataRow + lancamentos.length;
    
    // Adicionar fórmula SUM para somar a coluna D (valores)
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["", "", "TOTAL GERAL", { f: `SUM(D${startDataRow}:D${totalRow - 1})` }]
    ], { origin: `A${totalRow}` });

    // Rodapé
    const footerRow = totalRow + 2;
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["SISTEMA DE CONTROLE FINANCEIRO - CHARQUE RIOMAR"],
      ["Página 1 de 1 | Documento oficial"]
    ], { origin: `A${footerRow}` });

    // Configurar largura das colunas
    worksheet["!cols"] = [
      { wch: 30 }, // Setor
      { wch: 30 }, // Categoria  
      { wch: 15 }, // Data
      { wch: 20 }, // Valor
      { wch: 25 }, // Coluna extra
    ]

    // Mesclar células
    if (!worksheet["!merges"]) worksheet["!merges"] = []
    worksheet["!merges"].push(
      { s: { r: 0, c: 4 }, e: { r: 0, c: 8 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 2 } },
      { s: { r: 7, c: 3 }, e: { r: 7, c: 4 } }
    )

    // Formatar coluna de valores como moeda
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z100');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({r:R, c:C});
        if (!worksheet[cell_ref]) continue;
        
        // Formatar coluna D (valores) como moeda
        if (C === 3 && R >= startDataRow - 1) {
          if (!worksheet[cell_ref].z) {
            worksheet[cell_ref].z = '"R$" #,##0.00';
          }
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Lançamentos")

    // Nome do arquivo
    const fileName = `relatorio-charque-riomar-${new Date().toISOString().split("T")[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)

    return true
  } catch (error) {
    console.error("Erro ao gerar Excel:", error)
    alert("Erro ao gerar Excel. Tente novamente.")
    return false
  }
}