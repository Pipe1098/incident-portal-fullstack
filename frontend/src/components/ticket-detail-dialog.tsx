"use client"

import type { Ticket } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TicketDetailDialogProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  OPEN: { label: "Abierto", variant: "destructive" },
  IN_PROGRESS: { label: "En Progreso", variant: "default" },
  RESOLVED: { label: "Resuelto", variant: "secondary" },
  CLOSED: { label: "Cerrado", variant: "outline" },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: "Baja", className: "bg-muted text-muted-foreground" },
  MEDIUM: { label: "Media", className: "bg-status-in-progress/20 text-status-in-progress" },
  HIGH: { label: "Alta", className: "bg-status-open/20 text-status-open" },
  CRITICAL: { label: "Crítica", className: "bg-destructive/20 text-destructive" },
}

export function TicketDetailDialog({ ticket, open, onOpenChange }: TicketDetailDialogProps) {
  if (!ticket) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">{ticket.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">ID: {ticket.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Badge variant={statusConfig[ticket.status].variant}>{statusConfig[ticket.status].label}</Badge>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityConfig[ticket.priority].className}`}>
              Prioridad: {priorityConfig[ticket.priority].label}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Descripción</h4>
            <p className="text-foreground">{ticket.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Creado por</h4>
              <p className="text-foreground">{ticket.createdBy}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Asignado a</h4>
              <p className="text-foreground">{ticket.assignedTo || "Sin asignar"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Fecha de creación</h4>
              <p className="text-foreground text-sm">{format(new Date(ticket.createdAt), "PPpp", { locale: es })}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Última actualización</h4>
              <p className="text-foreground text-sm">{format(new Date(ticket.updatedAt), "PPpp", { locale: es })}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
