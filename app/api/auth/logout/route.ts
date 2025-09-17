import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value

    if (token) {
      // Fazer logout no Rails se necessário
      await fetch(`${process.env.RAILS_API_URL}/users/sign_out`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    }

    // Remover cookie de autenticação
    const response = NextResponse.json({ message: "Logout realizado com sucesso" })
    response.cookies.delete("authToken")

    return response
  } catch (error) {
    console.error("Erro no logout:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
