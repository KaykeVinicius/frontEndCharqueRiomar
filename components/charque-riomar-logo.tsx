import { cn } from "@/lib/utils"
import Image from "next/image"

interface CharqueRiomarLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function CharqueRiomarLogo({ className, size = "md" }: CharqueRiomarLogoProps) {
  const sizeClasses = {
    sm: "h-12 w-auto",
    md: "h-16 w-auto",
    lg: "h-24 w-auto",
    xl: "h-32 w-auto",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/images/charque-riomar-logo.png"
        alt="Charque Riomar"
        width={200}
        height={200}
        className={cn(sizeClasses[size], "object-contain")}
        priority
      />
    </div>
  )
}
