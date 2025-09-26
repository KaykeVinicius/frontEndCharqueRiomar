import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Cores da marca Charque Riomar: Vermelho e Preto
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '3 solid #D32F2F',
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNome: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  empresaDestaque: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  empresaTexto: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 2,
  },
  logoContainer: {
    alignItems: 'flex-end',
  },
  relatorioInfo: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666666',
  },
  table: {
    width: '100%',
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    padding: 10,
  },
  tableHeaderText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FAFAFA',
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: 12,
  },
  colSetor: {
    width: '30%',
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
  },
  colCategoria: {
    width: '30%',
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
  },
  colData: {
    width: '20%',
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
  },
  colValor: {
    width: '20%',
    fontSize: 9,
    textAlign: 'right',
    fontFamily: 'Courier-Bold',
    color: '#000000',
    fontWeight: 'bold',
  },
  totalLabel: {
    width: '80%',
    textAlign: 'right',
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalValue: {
    width: '20%',
    textAlign: 'right',
    fontSize: 10,
    fontFamily: 'Courier-Bold',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '2 solid #D32F2F',
    textAlign: 'center',
  },
  footerTexto: {
    fontSize: 8,
    color: '#000000',
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
        {/* Cabeçalho Institucional */}
        <View style={styles.header}>
          <View style={styles.empresaInfo}>
            <Text style={styles.empresaNome}>BIG CHARQUE INDUSTRIA E COMERCIO LTDA</Text>
            <Text style={styles.empresaDestaque}>CNPJ: 05.434.424/0001-88</Text>
            <Text style={styles.empresaTexto}>Rua Pedro Spagnol, 4234 - Teixeirao</Text>
            <Text style={styles.empresaTexto}>Cacoal - RO | CEP: 76965-598</Text>
            <Text style={styles.empresaTexto}>(69) 3443-2920</Text>
            <Text style={styles.empresaTexto}>comercial@charqueriomar.com.br</Text>
          </View>
          
          <View style={styles.logoContainer}>
            {/* Logo - você precisará ajustar o caminho da imagem */}
            <Image 
              src="charque-riomar-logo.png" 
              style={{ width: 80, height: 80, marginBottom: 10 }}
            />
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
              {titulo}
            </Text>
          </View>
        </View>

        {/* Informações do relatório (mais discretas) */}
        <View style={styles.relatorioInfo}>
          <Text>EMITIDO EM: {dataAtual}</Text>
          <Text>Total de lançamentos: {lancamentos.length}</Text>
        </View>

        {/* Tabela de Lançamentos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{...styles.tableHeaderText, width: '30%'}}>SETOR</Text>
            <Text style={{...styles.tableHeaderText, width: '30%'}}>CATEGORIA</Text>
            <Text style={{...styles.tableHeaderText, width: '20%'}}>DATA</Text>
            <Text style={{...styles.tableHeaderText, width: '20%', textAlign: 'right'}}>VALOR (R$)</Text>
          </View>

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

          <View style={styles.tableFooter}>
            <Text style={styles.totalLabel}>TOTAL GERAL</Text>
            <Text style={styles.totalValue}>R$ {totalFormatado}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>SISTEMA DE GESTÃO - CHARQUE RIOMAR</Text>
          <Text style={styles.footerTexto}>Página 1 de 1 | Documento oficial</Text>
        </View>
      </Page>
    </Document>
  );
}