import { type NextRequest, NextResponse } from "next/server"
import { getLocalTickets, updateLocalTicket, deleteLocalTicket } from "@/lib/mock-data"

// Server-side config - API_KEY 
const API_BASE_URL = process.env.API_URL
const API_KEY = process.env.API_KEY

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY || "",
}

function shouldUseMock() {
  return !API_BASE_URL || !API_KEY
}

// GET /api/tickets/[id] - Get a single ticket
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (shouldUseMock()) {
    const ticket = getLocalTickets().find((t) => t.id === id)
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    return NextResponse.json(ticket)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, { headers })

    if (response.status === 404) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    if (!response.ok) throw new Error("API Error")

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    const ticket = getLocalTickets().find((t) => t.id === id)
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    return NextResponse.json(ticket)
  }
}

// PATCH /api/tickets/[id] - Update a ticket
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  if (shouldUseMock()) {
    const updated = updateLocalTicket(id, body)
    if (!updated) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    })

    if (response.status === 404) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    if (!response.ok) throw new Error("API Error")

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    const updated = updateLocalTicket(id, body)
    if (!updated) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  }
}

// DELETE /api/tickets/[id] - Delete a ticket
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (shouldUseMock()) {
    const ticket = getLocalTickets().find((t) => t.id === id)
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    deleteLocalTicket(id)
    return new NextResponse(null, { status: 204 })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: "DELETE",
      headers,
    })

    if (response.status === 404) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    if (!response.ok) throw new Error("API Error")

    return new NextResponse(null, { status: 204 })
  } catch {
    deleteLocalTicket(id)
    return new NextResponse(null, { status: 204 })
  }
}
