export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
  createdBy: string
  assignedTo?: string
}

export interface CreateTicketInput {
  title: string
  description: string
  priority: TicketPriority
  createdBy: string
  assignedTo?: string
}

export interface UpdateTicketInput {
  status?: TicketStatus
  priority?: TicketPriority
  assignedTo?: string
  description?: string
}
