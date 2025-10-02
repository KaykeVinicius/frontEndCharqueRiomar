"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerWithRangeProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({ className, date, onDateChange }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [fromInput, setFromInput] = React.useState("")
  const [toInput, setToInput] = React.useState("")

  React.useEffect(() => {
    if (date?.from) {
      setFromInput(format(date.from, "dd/MM/yyyy"))
    } else {
      setFromInput("")
    }
    if (date?.to) {
      setToInput(format(date.to, "dd/MM/yyyy"))
    } else {
      setToInput("")
    }
  }, [date])

  const handleFromInputChange = (value: string) => {
    setFromInput(value)
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date())
        if (!isNaN(parsedDate.getTime())) {
          onDateChange?.({ from: parsedDate, to: date?.to })
        }
      } catch (e) {
        // Erro silencioso ao parsear data
      }
    }
  }

  const handleToInputChange = (value: string) => {
    setToInput(value)
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date())
        if (!isNaN(parsedDate.getTime())) {
          onDateChange?.({ from: date?.from, to: parsedDate })
        }
      } catch (e) {
        // Erro silencioso ao parsear data
      }
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b space-y-2">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">De:</label>
                <Input
                  placeholder="DD/MM/AAAA"
                  value={fromInput}
                  onChange={(e) => handleFromInputChange(e.target.value)}
                  maxLength={10}
                  className="h-8"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Até:</label>
                <Input
                  placeholder="DD/MM/AAAA"
                  value={toInput}
                  onChange={(e) => handleToInputChange(e.target.value)}
                  maxLength={10}
                  className="h-8"
                />
              </div>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              onDateChange?.(newDate)
              if (newDate?.from && newDate?.to) {
                setIsOpen(false)
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
