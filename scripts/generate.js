const fs = require("fs")
const path = require("path")

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error("Uso: node scripts/generate.js <EntityName> <field1:type1> [<field2:type2> ...]")
  process.exit(1)
}

const entityName = args[0] // Produto
const fields = args.slice(1) // ["nome:string", "preco:integer"]

const entityLower = entityName.toLowerCase()
const entityPlural = entityLower + "s"
const entityPascal = entityName

// Parse campos para gerar interface
const parsedFields = fields.map(f => {
  const [name, type] = f.split(":")
  let tsType = "string"
  if (type) {
    if (type.toLowerCase() === "integer" || type.toLowerCase() === "number") tsType = "number"
    else if (type.toLowerCase() === "boolean") tsType = "boolean"
    else tsType = type
  }
  return { name, type: tsType }
})

// Paths
const basePath = path.join("app", "(@pages)", entityPlural)
const apiPath = path.join(basePath, "api")
const componentsPath = path.join(basePath, "components")
const hooksPath = path.join(basePath, "hooks")
const typesPath = path.join("app", "@types")

// Criar pastas
;[basePath, apiPath, componentsPath, hooksPath, typesPath].forEach(p => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
})

// Gerar interface
const interfaceContent = `export interface ${entityPascal} {
  id: number;
${parsedFields.map(f => `  ${f.name}: ${f.type};`).join("\n")}
}
`
fs.writeFileSync(path.join(typesPath, `${entityPascal}.ts`), interfaceContent)

// Gerar API
const apiContent = `import { api } from "@/lib/api"
import { ${entityPascal} } from "@/app/@types/${entityPascal}"

export const ${entityLower}Api = {
  getAll: () => api.get<${entityPascal}[]>("/${entityPlural}"),
  getById: (id: number) => api.get<${entityPascal}>(\`/${entityPlural}/\${id}\`),
  create: (data: Partial<${entityPascal}>) => api.post<${entityPascal}>("/${entityPlural}", data),
  update: (id: number, data: Partial<${entityPascal}>) => api.put<${entityPascal}>(\`/${entityPlural}/\${id}\`, data),
  delete: (id: number) => api.delete(\`/${entityPlural}/\${id}\`),
}
`
fs.writeFileSync(path.join(apiPath, `${entityLower}.ts`), apiContent)

// Gerar Hook
const hookContent = `import { useState, useEffect } from "react"
import { ${entityLower}Api } from "../api/${entityLower}"
import { ${entityPascal} } from "@/app/@types/${entityPascal}"

export function use${entityPascal}s() {
  const [${entityPlural}, set${entityPascal}s] = useState<${entityPascal}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ${entityLower}Api.getAll()
      .then(data => set${entityPascal}s(data))
      .catch(err => console.error("Erro ao buscar ${entityPlural}:", err))
      .finally(() => setLoading(false))
  }, [])

  const create${entityPascal} = async (data: Partial<${entityPascal}>) => {
    const created = await ${entityLower}Api.create(data)
    set${entityPascal}s([...${entityPlural}, created])
    return created
  }

  const update${entityPascal} = async (id: number, data: Partial<${entityPascal}>) => {
    const updated = await ${entityLower}Api.update(id, data)
    set${entityPascal}s(${entityPlural}.map(e => e.id === updated.id ? updated : e))
    return updated
  }

  const delete${entityPascal} = async (id: number) => {
    await ${entityLower}Api.delete(id)
    set${entityPascal}s(${entityPlural}.filter(e => e.id !== id))
  }

  return { ${entityPlural}, loading, create${entityPascal}, update${entityPascal}, delete${entityPascal} }
}
`
fs.writeFileSync(path.join(hooksPath, `use${entityPascal}s.ts`), hookContent)

// Gerar Component
const componentContent = `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { use${entityPascal}s } from "../hooks/use${entityPascal}s"

export function ${entityPascal}Content() {
  const { ${entityPlural}, loading, create${entityPascal}, update${entityPascal}, delete${entityPascal} } = use${entityPascal}s()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<null | ${entityPascal}>(null)
  const [formData, setFormData] = useState<Partial<${entityPascal}>>({ ${parsedFields.map(f => `${f.name}: ""`).join(", ")} })

  const filtered = ${entityPlural}.filter(e =>
    ${parsedFields.map(f => `(e.${f.name} || "").toString().toLowerCase().includes(searchTerm.toLowerCase())`).join(" || ")}
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) await update${entityPascal}(editing.id, formData)
    else await create${entityPascal}(formData)
    setFormData({ ${parsedFields.map(f => `${f.name}: ""`).join(", ")} })
    setEditing(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (item: ${entityPascal}) => {
    setEditing(item)
    setFormData(${parsedFields.reduce((acc, f) => ({ ...acc, [f.name]: `item.${f.name}` }), {})})
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => delete${entityPascal}(id)

  if (loading) return <p>Carregando ${entityPlural}...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">${entityPascal}s</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setFormData({ ${parsedFields.map(f => `${f.name}: ""`).join(", ")} }) }}>
              <Plus className="mr-2 h-4 w-4" /> Novo ${entityPascal}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar ${entityPascal}" : "Novo ${entityPascal}"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              ${parsedFields.map(f => `
              <div className="grid gap-2 py-2">
                <Input
                  value={formData.${f.name}}
                  onChange={e => setFormData({ ...formData, ${f.name}: e.target.value })}
                  placeholder="${f.name.charAt(0).toUpperCase() + f.name.slice(1)}"
                  required
                />
              </div>`).join("")}
              <DialogFooter>
                <Button type="submit">{editing ? "Salvar" : "Criar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de ${entityPascal}s</CardTitle>
          <CardDescription>{${entityPlural}.length} ${entityPlural} cadastrad${entityPlural.length !== 1 ? "os" : "o"}</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                ${parsedFields.map(f => `<TableHead>${f.name.charAt(0).toUpperCase() + f.name.slice(1)}</TableHead>`).join("\n")}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.id}>
                  ${parsedFields.map(f => `<TableCell>{item.${f.name}}</TableCell>`).join("\n")}
                  <TableCell><Badge variant="default">ativo</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Edit className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
`
fs.writeFileSync(path.join(componentsPath, `${entityPascal}Content.tsx`), componentContent)

// Gerar Page
const pageContent = `import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { ${entityPascal}Content } from "./components/${entityPascal}Content"

export default function ${entityPascal}Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <${entityPascal}Content />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
`
fs.writeFileSync(path.join(basePath, "page.tsx"), pageContent)

console.log(`✅ Estrutura de ${entityPascal} criada com sucesso!`)
