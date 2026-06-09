import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import LoginPage from '../pages/LoginPage'

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn())
})

describe('LoginPage', () => {
  it('renderiza campos de RA e senha', () => {
    renderLogin()
    expect(screen.getByLabelText(/registro acadêmico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('mostra erro quando RA está vazio', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/preencha o registro acadêmico/i)
  })

  it('mostra erro quando RA tem formato inválido (< 7 dígitos)', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/registro acadêmico/i), '123')
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123')
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/7 dígitos/i)
  })

  it('mostra erro quando senha é muito curta', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/registro acadêmico/i), '2024001')
    await userEvent.type(screen.getByLabelText(/senha/i), 'ab')
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/pelo menos 4 caracteres/i)
  })

  it('mostra erro de credenciais quando API retorna 401', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)

    renderLogin()
    await userEvent.type(screen.getByLabelText(/registro acadêmico/i), '2024001')
    await userEvent.type(screen.getByLabelText(/senha/i), 'errada123')
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/ra ou senha inválidos/i),
    )
  })

  it('não exibe dica de credenciais demo no HTML', () => {
    renderLogin()
    expect(screen.queryByText(/demo/i)).toBeNull()
  })
})
