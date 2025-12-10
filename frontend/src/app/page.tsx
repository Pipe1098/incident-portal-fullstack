"use client"

import { useState, useEffect, useCallback } from "react"
import type { Ticket, TicketStatus, CreateTicketInput } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard-header"
import { TicketStats } from "@/components/ticket-stats"
import { TicketFilters } from "@/components/ticket-filters"


export default function Home() {

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
   const [currentFilter, setCurrentFilter] = useState<TicketStatus | "ALL">("ALL")

  const loadTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

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

          
        </div>
      </main>
    </div>
  )
}
