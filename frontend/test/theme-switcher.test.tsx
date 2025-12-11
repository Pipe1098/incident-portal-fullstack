import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSwitcher } from '@/components/theme-switcher'

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('renders and toggles theme', async () => {
    render(<ThemeSwitcher />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()

    // default should be light (no .dark)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await userEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')

    await userEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
