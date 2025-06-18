import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("file") || "mental_health_data.csv"

  try {
    const filePath = path.join(process.cwd(), "public", "data", filename)

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 })
    }

    // Lê o arquivo
    const fileContent = fs.readFileSync(filePath, "utf-8")

    // Retorna o conteúdo como texto
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Erro ao ler arquivo:", error)
    return NextResponse.json({ error: "Erro ao processar o arquivo" }, { status: 500 })
  }
}
