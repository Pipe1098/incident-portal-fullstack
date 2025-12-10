"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react"

interface TicketStatsProps {
  tickets: Ticket[]
}

export function TicketStats({ tickets }: TicketStatsProps) {
  const stats = {
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
    closed: tickets.filter((t) => t.status === "CLOSED").length,
  }

  const statCards = [
    { label: "Abiertos", value: stats.open, icon: AlertCircle, color: "text-status-open" },
    { label: "En Progreso", value: stats.inProgress, icon: Clock, color: "text-status-in-progress" },
    { label: "Resueltos", value: stats.resolved, icon: CheckCircle2, color: "text-status-resolved" },
    { label: "Cerrados", value: stats.closed, icon: XCircle, color: "text-status-closed" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
