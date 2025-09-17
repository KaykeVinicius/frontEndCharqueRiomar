import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>DS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Desossa</p>
          <p className="text-sm text-muted-foreground">Manutenção de Máquinas</p>
        </div>
        <div className="ml-auto font-medium">-R$ 1.999,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Salga</p>
          <p className="text-sm text-muted-foreground">Material de Limpeza</p>
        </div>
        <div className="ml-auto font-medium">-R$ 39,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>VR</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Varal</p>
          <p className="text-sm text-muted-foreground">Energia Elétrica</p>
        </div>
        <div className="ml-auto font-medium">-R$ 299,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>DS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Desossa</p>
          <p className="text-sm text-muted-foreground">Equipamentos de Segurança</p>
        </div>
        <div className="ml-auto font-medium">-R$ 99,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Salga</p>
          <p className="text-sm text-muted-foreground">Sal Industrial</p>
        </div>
        <div className="ml-auto font-medium">-R$ 2.500,00</div>
      </div>
    </div>
  )
}
