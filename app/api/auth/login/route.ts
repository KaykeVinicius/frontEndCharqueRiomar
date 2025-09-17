import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Fazer requisição para o backend Rails
    const railsResponse = await fetch(`${process.env.RAILS_API_URL}/users/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    if (railsResponse.ok) {
      const data = await railsResponse.json()

      // Criar resposta com cookie seguro
      const response = NextResponse.json(data)

      // Definir cookie com token de autenticação
      if (data.token) {
        response.cookies.set("authToken", data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      return response
    } else {
      const errorData = await railsResponse.json()
      return NextResponse.json({ error: errorData.error || "CPF ou senha inválidos" }, { status: 401 })
    }
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
