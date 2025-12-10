"use client"

import type { TicketStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TicketFiltersProps {
  currentFilter: TicketStatus | "ALL"
  onFilterChange: (filter: TicketStatus | "ALL") => void
}

const filters: { value: TicketStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "OPEN", label: "Abiertos" },
  { value: "IN_PROGRESS", label: "En Progreso" },
  { value: "RESOLVED", label: "Resueltos" },
  { value: "CLOSED", label: "Cerrados" },
]

export function TicketFilters({ currentFilter, onFilterChange }: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? "default" : "secondary"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className={cn("transition-all", currentFilter === filter.value && "bg-primary text-primary-foreground")}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
