"use client"

import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Plus, RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  onCreateTicket: () => void
  onRefresh: () => void
  isLoading?: boolean
}

export function DashboardHeader({ onCreateTicket, onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portal de Incidencias</h1>
            <p className="text-sm text-muted-foreground">Sistema de seguimiento y gestión de tickets</p>
          </div>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button size="sm" onClick={onCreateTicket}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Ticket
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
