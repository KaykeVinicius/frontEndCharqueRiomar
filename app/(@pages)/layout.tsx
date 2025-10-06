import type React from "react";
import AuthProtected from "@/components/auth-protected";

// ✅ Este layout protege TODAS as páginas dentro de (@pages)
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProtected>{children}</AuthProtected>;
}