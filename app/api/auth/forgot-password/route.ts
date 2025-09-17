import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Fazer requisição para o backend Rails Devise
    const railsResponse = await fetch(`${process.env.RAILS_API_URL}/users/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    if (railsResponse.ok) {
      return NextResponse.json({ message: "Email de recuperação enviado com sucesso" })
    } else {
      const errorData = await railsResponse.json()
      return NextResponse.json({ error: errorData.error || "Email não encontrado" }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro na recuperação de senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
