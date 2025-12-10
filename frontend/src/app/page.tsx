"use client"

import { useState, useEffect, useCallback } from "react"
import type { Ticket, TicketStatus, CreateTicketInput } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard-header"

export default function Home() {
 
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)

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

     
    </div>
  )
}
