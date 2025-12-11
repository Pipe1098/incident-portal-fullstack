import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as api from '@/lib/api'
import type { CreateTicketInput } from '@/lib/types'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('api wrapper', () => {
  it('getTickets returns parsed json when ok', async () => {
    const fake = [{ id: '1', title: 'x' }]
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => fake } as unknown as Response))
    const res = await api.getTickets()
    expect(res).toEqual(fake)
  })

  it('createTicket throws on non-ok', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false } as unknown as Response))
    const input: CreateTicketInput = { title: 'a', description: 'b', priority: 'LOW', createdBy: 'test' }
    await expect(api.createTicket(input)).rejects.toThrow()
  })
})
