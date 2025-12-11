import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as api from '@/lib/api'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('api wrapper', () => {
  it('getTickets returns parsed json when ok', async () => {
    const fake = [{ id: '1', title: 'x' }]
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fake) } as any))
    const res = await api.getTickets()
    expect(res).toEqual(fake)
  })

  it('createTicket throws on non-ok', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false } as any))
    await expect(api.createTicket({ title: 'a', description: 'b' } as any)).rejects.toThrow()
  })
})
