import type React from "react";
import type { Metadata } from "next";
import { Roboto, Fira_Code } from 'next/font/google'; // Fontes válidas
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Fonte Sans substituindo Geist Sans
const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "100"
});

// Fonte Mono substituindo Geist Mono
const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charque Riomar - Sistema de Controle Financeiro",
  description: "Sistema de controle de gastos por setores e categorias",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} ${firaCode.variable} antialiased`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
