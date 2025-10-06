import type React from "react";
import type { Metadata } from "next";
import { Roboto, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Fonte Sans substituindo Geist Sans
const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"], 
});

// Fonte Mono substituindo Geist Mono
const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charque Riomar - Sistema de Controle Financeiro",
  description: "Sistema de controle de gastos por setores e categorias",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${roboto.variable} ${firaCode.variable} antialiased`}
    >
      <body>
        {/* Aqui usamos o ThemeProvider, que é Client Component */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
