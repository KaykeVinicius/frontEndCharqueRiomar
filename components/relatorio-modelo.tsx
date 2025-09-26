"use client";

import { Lancamento } from "@/app/@types/Lancamento";

interface RelatorioModeloProps {
  lancamentos: Lancamento[];
  titulo?: string;
}

export function RelatorioModelo({ lancamentos, titulo = "Relatório de Lançamentos" }: RelatorioModeloProps) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const total = lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0);

  return (
    <div id="relatorio-modelo" className="relatorio-container">
      {/* Logo como fundo opaco (só aparece no PDF) */}
      <div className="background-logo"></div>
      
      {/* Cabeçalho Institucional */}
      <header className="cabecalho-institucional">
        <div className="empresa-info">
          <h1>Charque Riomar</h1>
          <p>CNPJ: 00.753.966/0001-08</p>
          <p>Avenida Sete de Setembro, 2819 - Centro, Cacoal - RO</p>
          <p>CEP: 76963-851</p>
           <p>Telefone: (69) 3441-5461</p> 
          <p>E-mail: frigorificoriomar-olsen@hotmail.com</p>
        </div>
        <div className="relatorio-info">
          <h2>{titulo}</h2>
          <p>Emitido em: {dataAtual}</p>
          <p>Total de lançamentos: {lancamentos.length}</p>
        </div>
      </header>

      {/* Tabela de Lançamentos */}
      <table className="tabela-lancamentos">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {lancamentos.map((lancamento, index) => (
            <tr key={lancamento.id || index}>
              <td>{lancamento.setor?.nome || "N/A"}</td>
              <td>{lancamento.categoria?.nome || "N/A"}</td>
              <td>{new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
              <td className="valor">{(lancamento.valor || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="total-label">TOTAL GERAL</td>
            <td className="total-value">R$ {total.toLocaleString('pt-BR', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}</td>
          </tr>
        </tfoot>
      </table>

      {/* Rodapé */}
      <footer className="rodape">
        <p>Sistema de Gestão - Charque Riomar</p>
        <p>Página 1 de 1</p>
      </footer>

      <style jsx>{`
        .relatorio-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          color: #333;
        }

        .background-logo {
          display: none; /* Só aparece no PDF */
        }

        .cabecalho-institucional {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #8b5cf6;
        }

        .empresa-info h1 {
          color: #8b5cf6;
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        .empresa-info p {
          margin: 2px 0;
          font-size: 12px;
          color: #666;
        }

        .relatorio-info h2 {
          margin: 0 0 10px 0;
          color: #333;
          text-align: right;
        }

        .relatorio-info p {
          margin: 2px 0;
          font-size: 12px;
          text-align: right;
        }

        .tabela-lancamentos {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .tabela-lancamentos th {
          background-color: #8b5cf6;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }

        .tabela-lancamentos td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        .tabela-lancamentos tr:hover {
          background-color: #f5f5f5;
        }

        .valor {
          text-align: right;
          font-family: 'Courier New', monospace;
          font-weight: bold;
        }

        .total-label {
          text-align: right;
          font-weight: bold;
          background-color: #f0f0f0;
        }

        .total-value {
          text-align: right;
          font-weight: bold;
          background-color: #f0f0f0;
          font-family: 'Courier New', monospace;
          color: #059669;
        }

        .rodape {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }

        /* Estilos específicos para impressão/PDF */
        @media print {
          .relatorio-container {
            padding: 0;
          }
          
          .background-logo {
            display: block;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background-image: url('/image/charque-riomar-logo.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.1;
            z-index: -1;
          }
          
          .cabecalho-institucional {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          
          .tabela-lancamentos th {
            background-color: #8b5cf6 !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}