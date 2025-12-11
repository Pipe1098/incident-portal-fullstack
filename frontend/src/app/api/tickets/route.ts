import { type NextRequest, NextResponse } from "next/server"
import type { Ticket, TicketStatus } from "@/lib/types"
import { getLocalTickets, addLocalTicket } from "@/lib/mock-data"

// Server-side config - lee variables de entorno
// Para desarrollo local: API_URL=http://localhost:3001 API_KEY=dev-key
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY || "",
}

// Helper to check if we should use mock data
function shouldUseMock() {
  const shouldUse = !API_BASE_URL || !API_KEY
  if (shouldUse) {
    console.log("⚠️  Usando MOCK DATA - API_BASE_URL o API_KEY no configurados")
    console.log(`   API_BASE_URL: ${API_BASE_URL || "❌ NO DEFINIDA"}`)
    console.log(`   API_KEY: ${API_KEY ? "✅ Configurada" : "❌ NO DEFINIDA"}`)
  }
  return shouldUse
}

// GET /api/tickets - Get all tickets or filter by status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") as TicketStatus | null

  if (shouldUseMock()) {
    let tickets = getLocalTickets()
    if (status) {
      tickets = tickets.filter((t) => t.status === status)
    }
    return NextResponse.json(tickets)
  }

  try {
    const url = status ? `${API_BASE_URL}/tickets?status=${status}` : `${API_BASE_URL}/tickets`
    console.log(`📡 Llamando a API backend: ${url}`)
    const response = await fetch(url, { headers })

    if (!response.ok) {
      console.error(`❌ Error API (${response.status}): ${response.statusText}`)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ Datos recibidos del backend: ${data.length || 0} tickets`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("⚠️  Error al llamar API backend, usando mock data:", error)
    // Fallback to mock data on error
    let tickets = getLocalTickets()
    if (status) {
      tickets = tickets.filter((t) => t.status === status)
    }
    return NextResponse.json(tickets)
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  const body = await request.json()

  if (shouldUseMock()) {
    const newTicket: Ticket = {
      id: String(Date.now()),
      ...body,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addLocalTicket(newTicket)
    return NextResponse.json(newTicket, { status: 201 })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) throw new Error("API Error")

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch {
    // Fallback to mock
    const newTicket: Ticket = {
      id: String(Date.now()),
      ...body,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addLocalTicket(newTicket)
    return NextResponse.json(newTicket, { status: 201 })
  }
}
