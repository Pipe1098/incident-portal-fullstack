import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DashboardHeader } from '@/components/dashboard-header'

describe('DashboardHeader', () => {
  it('renders title and buttons and calls handlers', async () => {
    const onCreate = vi.fn()
    const onRefresh = vi.fn()
    render(<DashboardHeader onCreateTicket={onCreate} onRefresh={onRefresh} isLoading={false} />)

    expect(screen.getByText('Portal de Incidencias')).toBeInTheDocument()
    const refresh = screen.getByRole('button', { name: /Actualizar/i })
    const create = screen.getByRole('button', { name: /Nuevo Ticket/i })
    expect(refresh).toBeInTheDocument()
    expect(create).toBeInTheDocument()

    await userEvent.click(refresh)
    expect(onRefresh).toHaveBeenCalled()

    await userEvent.click(create)
    expect(onCreate).toHaveBeenCalled()
  })
})
