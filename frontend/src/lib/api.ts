import type { Ticket, CreateTicketInput, UpdateTicketInput, TicketStatus } from "./types"

// All API calls go through our server-side route handlers

export async function getTickets(status?: TicketStatus): Promise<Ticket[]> {
  const url = status ? `/api/tickets?status=${status}` : `/api/tickets`
  const response = await fetch(url)
  if (!response.ok) throw new Error("Failed to fetch tickets")
  return response.json()
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const response = await fetch(`/api/tickets/${id}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error("Failed to fetch ticket")
  return response.json()
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error("Failed to create ticket")
  return response.json()
}

export async function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
  const response = await fetch(`/api/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error("Failed to update ticket")
  return response.json()
}

export async function deleteTicket(id: string): Promise<void> {
  const response = await fetch(`/api/tickets/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete ticket")
}
