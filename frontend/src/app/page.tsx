"use client"

import { useState, useEffect, useCallback } from "react"
import type { Ticket, TicketStatus, CreateTicketInput } from "@/lib/types"
import { getTickets, createTicket, updateTicket, deleteTicket } from "@/lib/api"
import { DashboardHeader } from "@/components/dashboard-header"
import { TicketStats } from "@/components/ticket-stats"
import { TicketFilters } from "@/components/ticket-filters"
import { TicketTable } from "@/components/ticket-table"
import { toast } from "sonner"

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [currentFilter, setCurrentFilter] = useState<TicketStatus | "ALL">("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const loadTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getTickets()
      setTickets(data)
    } catch {
      toast.error("No se pudieron cargar los tickets")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  useEffect(() => {
    if (currentFilter === "ALL") {
      setFilteredTickets(tickets)
    } else {
      setFilteredTickets(tickets.filter((t) => t.status === currentFilter))
    }
  }, [tickets, currentFilter])

  const handleCreateTicket = async (input: CreateTicketInput) => {
    try {
      const newTicket = await createTicket(input)
      setTickets((prev) => [newTicket, ...prev])
      setIsCreateDialogOpen(false)
      toast.success("El ticket se ha creado correctamente")
    } catch {
      toast.error("No se pudo crear el ticket")
    }
  }

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    try {
      const updated = await updateTicket(id, { status })
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)))
      const statusText = status === "OPEN" ? "Abierto" : status === "IN_PROGRESS" ? "En Progreso" : status === "RESOLVED" ? "Resuelto" : "Cerrado"
      toast.success(`El ticket ahora está ${statusText}`)
    } catch {
      toast.error("No se pudo actualizar el estado")
    }
  }

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteTicket(id)
      setTickets((prev) => prev.filter((t) => t.id !== id))
      toast.success("El ticket se ha eliminado correctamente")
    } catch {
      toast.error("No se pudo eliminar el ticket")
    }
  }

  const handleViewTicket = (ticket: Ticket) => {
    // TODO: Implementar modal o página de detalle del ticket
    console.log("Ver ticket:", ticket)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onCreateTicket={() => setIsCreateDialogOpen(true)}
        onRefresh={loadTickets}
        isLoading={isLoading}
      />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <TicketStats tickets={tickets} />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Lista de Tickets</h2>
            <TicketFilters currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
          </div>

          <TicketTable
            tickets={filteredTickets}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTicket}
            onView={handleViewTicket}
          />
        </div>
      </main>
    </div>
  )
}
