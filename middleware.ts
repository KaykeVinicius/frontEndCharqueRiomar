import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/forgot-password", "/api/auth/login"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Para produção, remover este comentário e habilitar a verificação de token
  /*
  // Verificar se o usuário está autenticado
  const token = request.cookies.get("authToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    // Redirecionar para login se não estiver autenticado
    return NextResponse.redirect(new URL("/login", request.url))
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
