import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Cores da marca Charque Riomar: Vermelho e Preto
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica-Bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottom: '3 solid #D32F2F', // Vermelho da marca
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNome: {
    fontSize: 22,
    color: '#D32F2F', // Vermelho
    marginBottom: 8,
    fontWeight: 'bold',
  },
  empresaDestaque: {
    fontSize: 10,
    color: '#000000', // Preto
    marginBottom: 3,
    fontWeight: 'bold',
  },
  empresaTexto: {
    fontSize: 9,
    color: '#333333', // Cinza escuro
    marginBottom: 2,
    fontWeight: 'normal',
  },
  relatorioInfo: {
    alignItems: 'flex-end',
  },
  relatorioTitulo: {
    fontSize: 16,
    color: '#000000', // Preto
    marginBottom: 8,
    fontWeight: 'bold',
  },
  relatorioDestaque: {
    fontSize: 10,
    color: '#000000', // Preto
    marginBottom: 3,
    fontWeight: 'bold',
  },
  relatorioTexto: {
    fontSize: 9,
    color: '#333333', // Cinza escuro
    marginBottom: 2,
    fontWeight: 'normal',
  },
  table: {
    width: '100%',
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F', // Vermelho
    padding: 10,
  },
  tableHeaderText: {
    color: '#FFFFFF', // Branco
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E0E0E0',
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  tableRowAlternate: {
    flexDirection: 'row',
    borderBottom: '1 solid #E0E0E0',
    padding: 8,
    backgroundColor: '#FAFAFA', // Cinza muito claro para zebrado
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#000000', // Preto
    padding: 12,
  },
  colSetor: {
    width: '30%',
    fontSize: 9,
    color: '#000000', // Preto
    fontWeight: 'bold',
  },
  colCategoria: {
    width: '30%',
    fontSize: 9,
    color: '#000000', // Preto
    fontWeight: 'bold',
  },
  colData: {
    width: '20%',
    fontSize: 9,
    color: '#000000', // Preto
    fontWeight: 'bold',
  },
  colValor: {
    width: '20%',
    fontSize: 9,
    textAlign: 'right',
    fontFamily: 'Courier-Bold',
    color: '#000000', // Preto
    fontWeight: 'bold',
  },
  totalLabel: {
    width: '80%',
    textAlign: 'right',
    fontSize: 10,
    color: '#FFFFFF', // Branco
    fontWeight: 'bold',
  },
  totalValue: {
    width: '20%',
    textAlign: 'right',
    fontSize: 10,
    fontFamily: 'Courier-Bold',
    color: '#FFFFFF', // Branco
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '2 solid #D32F2F', // Vermelho
    textAlign: 'center',
  },
  footerTexto: {
    fontSize: 8,
    color: '#000000', // Preto
    fontWeight: 'bold',
  },
});

interface RelatorioPDFProps {
  lancamentos: any[];
  titulo?: string;
}

export function RelatorioPDF({ lancamentos, titulo = "RELATÓRIO DE LANÇAMENTOS" }: RelatorioPDFProps) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const total = lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0);
  
  // 🔹 CORREÇÃO: Formatação correta dos valores
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  const totalFormatado = formatarValor(total);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho Institucional - Cores Vermelho e Preto */}
        <View style={styles.header}>
          <View style={styles.empresaInfo}>
            <Text style={styles.empresaNome}>CHARQUE RIOMAR</Text>
            <Text style={styles.empresaDestaque}>CNPJ: 00.753.966/0001-08</Text>
            <Text style={styles.empresaTexto}>Avenida Sete de Setembro, 2819 - Centro</Text>
            <Text style={styles.empresaTexto}>Cacoal - RO | CEP: 76963-851</Text>
            <Text style={styles.empresaTexto}>(69) 3441-5461</Text>
            <Text style={styles.empresaTexto}>frigorificoriomar-olsen@hotmail.com</Text>
            <View style={styles.relatorioInfo}>
                <Text style={styles.relatorioTitulo}>{titulo}</Text>
                <Text style={styles.relatorioDestaque}>EMITIDO EM: {dataAtual}</Text>
                <Text style={styles.relatorioTexto}>Total de lançamentos: {lancamentos.length}</Text>
                <Text style={styles.relatorioDestaque}>
                </Text>
            </View>
            </View>
          </View>
          

        {/* Tabela de Lançamentos */}
        <View style={styles.table}>
          {/* Cabeçalho da tabela */}
          <View style={styles.tableHeader}>
            <Text style={{...styles.tableHeaderText, width: '30%'}}>SETOR</Text>
            <Text style={{...styles.tableHeaderText, width: '30%'}}>CATEGORIA</Text>
            <Text style={{...styles.tableHeaderText, width: '20%'}}>DATA</Text>
            <Text style={{...styles.tableHeaderText, width: '20%', textAlign: 'right'}}>VALOR (R$)</Text>
          </View>

          {/* Linhas da tabela com zebrado */}
          {lancamentos.map((lancamento, index) => (
            <View key={lancamento.id || index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
              <Text style={styles.colSetor}>{lancamento.setor?.nome || "N/A"}</Text>
              <Text style={styles.colCategoria}>{lancamento.categoria?.nome || "N/A"}</Text>
              <Text style={styles.colData}>
                {new Date(lancamento.data).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.colValor}>
                R$ {formatarValor(lancamento.valor || 0)}
              </Text>
            </View>
          ))}

          {/* Rodapé da tabela (Total) */}
          <View style={styles.tableFooter}>
            <Text style={styles.totalLabel}>TOTAL GERAL</Text>
            <Text style={styles.totalValue}>R$ {totalFormatado}</Text>
          </View>
        </View>

        {/* Rodapé da página */}
        <View style={styles.footer}>
          <Text style={styles.footerTexto}>SISTEMA DE GESTÃO - CHARQUE RIOMAR</Text>
          <Text style={styles.footerTexto}>Página 1 de 1 | Documento oficial</Text>
        </View>
      </Page>
    </Document>
  );
}