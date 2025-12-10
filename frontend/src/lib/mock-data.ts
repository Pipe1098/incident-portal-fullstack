import type { Ticket } from "./types"

// Mock data for demo purposes when external API is not available
export const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Error en el sistema de pagos",
    description: "Los usuarios reportan que no pueden completar pagos con tarjeta de crédito",
    status: "OPEN",
    priority: "CRITICAL",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: "usuario@empresa.com",
    assignedTo: "dev@empresa.com",
  },
  {
    id: "2",
    title: "Mejora en la UI del dashboard",
    description: "Actualizar los colores y el diseño del panel de administración",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: "diseño@empresa.com",
    assignedTo: "frontend@empresa.com",
  },
  {
    id: "3",
    title: "Documentar API REST",
    description: "Crear documentación Swagger para todos los endpoints",
    status: "RESOLVED",
    priority: "LOW",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "pm@empresa.com",
  },
  {
    id: "4",
    title: "Optimizar consultas de base de datos",
    description: "Las queries de reportes están tomando más de 10 segundos",
    status: "OPEN",
    priority: "HIGH",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdBy: "backend@empresa.com",
  },
  {
    id: "5",
    title: "Implementar autenticación 2FA",
    description: "Agregar autenticación de dos factores para mayor seguridad",
    status: "CLOSED",
    priority: "HIGH",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "security@empresa.com",
    assignedTo: "dev@empresa.com",
  },
]

// In-memory storage for demo mode
let localTickets = [...mockTickets]

export function getLocalTickets() {
  return localTickets
}

export function setLocalTickets(tickets: Ticket[]) {
  localTickets = tickets
}

export function addLocalTicket(ticket: Ticket) {
  localTickets = [ticket, ...localTickets]
}

export function updateLocalTicket(id: string, updates: Partial<Ticket>) {
  const index = localTickets.findIndex((t) => t.id === id)
  if (index !== -1) {
    localTickets[index] = { ...localTickets[index], ...updates, updatedAt: new Date().toISOString() }
    return localTickets[index]
  }
  return null
}

export function deleteLocalTicket(id: string) {
  localTickets = localTickets.filter((t) => t.id !== id)
}
