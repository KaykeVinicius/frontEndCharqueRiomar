import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "3 solid #D32F2F",
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNome: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "bold",
  },
  empresaDestaque: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 3,
    fontWeight: "bold",
  },
  empresaTexto: {
    fontSize: 9,
    color: "#333333",
    marginBottom: 2,
  },
  logoContainer: {
    alignItems: "flex-end",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  relatorioInfo: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#666666",
  },
  table: {
    width: "100%",
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    padding: 10,
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E0E0E0",
    padding: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  tableRowAlternate: {
    flexDirection: "row",
    borderBottom: "1 solid #E0E0E0",
    padding: 8,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },
  tableFooter: {
    flexDirection: "row",
    backgroundColor: "#000000",
    padding: 12,
    alignItems: "center",
  },
  colSetor: {
    width: "30%",
    fontSize: 9,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "left",
  },
  colQtd: {
    width: "25%",
    fontSize: 9,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },
  colValor: {
    width: "25%",
    fontSize: 9,
    textAlign: "center",
    fontFamily: "Courier-Bold",
    color: "#000000",
    fontWeight: "bold",
  },
  colMedia: {
    width: "20%",
    fontSize: 9,
    textAlign: "center",
    fontFamily: "Courier-Bold",
    color: "#000000",
    fontWeight: "bold",
  },
  totalLabel: {
    width: "30%",
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "left",
  },
  totalValue: {
    width: "25%",
    fontSize: 10,
    fontFamily: "Courier-Bold",
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "2 solid #D32F2F",
    textAlign: "center",
  },
  footerTexto: {
    fontSize: 8,
    color: "#000000",
    fontWeight: "bold",
  },
})

interface RelatorioSetoresPDFProps {
  data: any[]
  periodo: string
  lancamentosFiltrados: any[]
}

export function RelatorioSetoresPDF({ data, periodo, lancamentosFiltrados }: RelatorioSetoresPDFProps) {
  const dataAtual = new Date().toLocaleDateString("pt-BR")

  // Calcular totais e médias
  const dadosCompletos = data.map((item, index) => {
    const qtdLancamentos = lancamentosFiltrados.filter(l => l.setor?.nome === item.name).length;
    const valorMedio = qtdLancamentos > 0 ? item.value / qtdLancamentos : 0;
    return {
      ...item,
      posicao: index + 1,
      qtdLancamentos,
      valorMedio
    };
  });

  const totalGeral = data.reduce((sum, item) => sum + item.value, 0);
  const totalLancamentos = lancamentosFiltrados.length;
  const mediaGeral = totalLancamentos > 0 ? totalGeral / totalLancamentos : 0;

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho Institucional */}
        <View style={styles.header}>
          <View style={styles.empresaInfo}>
            <Text style={styles.empresaNome}>BIG CHARQUE INDUSTRIA E COMERCIO LTDA</Text>
            <Text style={styles.empresaDestaque}>CNPJ: 05.434.424/0001-88</Text>
            <Text style={styles.empresaTexto}>Rua Pedro Spagnol, 4234 - Teixeirão</Text>
            <Text style={styles.empresaTexto}>Cacoal - RO | CEP: 76965-598</Text>
            <Text style={styles.empresaTexto}>Telefone: (69) 3443-2920</Text>
            <Text style={styles.empresaTexto}>E-mail: comercial@charqueriomar.com.br</Text>
          </View>

          <View style={styles.logoContainer}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/charque-riomar-logo.png-8FKaDVVGGA85yYQhciSZ0af35HF6kE.jpeg"
              style={styles.logo}
            />
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#000000" }}>RELATÓRIO DE GASTOS POR SETOR</Text>
          </View>
        </View>

        {/* Informações do relatório */}
        <View style={styles.relatorioInfo}>
          <Text>EMITIDO EM: {dataAtual}</Text>
          <Text>PERÍODO: {periodo}</Text>
          <Text>Total de setores: {data.length}</Text>
        </View>

        {/* Tabela de Setores */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderText, width: "30%" }}>SETOR</Text>
            <Text style={{ ...styles.tableHeaderText, width: "25%" }}>QTD. LANÇAMENTOS</Text>
            <Text style={{ ...styles.tableHeaderText, width: "25%" }}>MÉDIA (R$)</Text>
            <Text style={{ ...styles.tableHeaderText, width: "20%" }}>VALOR TOTAL (R$)</Text>
          </View>

          {dadosCompletos.map((item, index) => (
            <View key={item.name} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
              <Text style={styles.colSetor}>{item.posicao}. {item.name}</Text>
              <Text style={styles.colQtd}>{item.qtdLancamentos}</Text>
              <Text style={styles.colMedia}>R$ {formatarValor(item.valorMedio)}</Text>
              <Text style={styles.colValor}>R$ {formatarValor(item.value)}</Text>
            </View>
          ))}

          <View style={styles.tableFooter}>
            <Text style={styles.totalLabel}>TOTAL GERAL</Text>
            <Text style={styles.totalValue}>{totalLancamentos}</Text>
            <Text style={styles.totalValue}>R$ {formatarValor(mediaGeral)}</Text>
            <Text style={styles.totalValue}>R$ {formatarValor(totalGeral)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>SISTEMA DE CONTROLE FINANCEIRO - CHARQUE RIOMAR</Text>
          <Text style={styles.footerTexto}>Página 1 de 1 | Documento oficial</Text>
        </View>
      </Page>
    </Document>
  )
}