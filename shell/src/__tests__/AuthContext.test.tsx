import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth/AuthContext'

const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ ra: '2024001', nome: 'João Mello', curso: 'CC', semestre: '4º', email: 'j@uni.edu' })) +
  '.signature'

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useAuth', () => {
  it('começa sem usuário logado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })

  it('login retorna true e popula user quando API responde com token válido', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: FAKE_JWT }),
    } as Response)

    const { result } = renderHook(() => useAuth(), { wrapper })

    let success: boolean
    await act(async () => {
      success = await result.current.login('2024001', 'uniportal')
    })

    expect(success!).toBe(true)
    expect(result.current.user?.ra).toBe('2024001')
    expect(result.current.user?.nome).toBe('João Mello')
    expect(localStorage.getItem('uniportal_token')).toBe(FAKE_JWT)
  })

  it('login retorna false quando API retorna 401', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)

    const { result } = renderHook(() => useAuth(), { wrapper })

    let success: boolean
    await act(async () => {
      success = await result.current.login('2024001', 'errada')
    })

    expect(success!).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('login retorna false quando fetch lança exceção (offline)', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    let success: boolean
    await act(async () => {
      success = await result.current.login('2024001', 'uniportal')
    })

    expect(success!).toBe(false)
  })

  it('logout limpa user e localStorage', async () => {
    localStorage.setItem('uniportal_token', FAKE_JWT)

    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user?.ra).toBe('2024001')

    act(() => { result.current.logout() })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(localStorage.getItem('uniportal_token')).toBeNull()
  })

  it('persiste sessão ao recarregar — lê token do localStorage na inicialização', () => {
    localStorage.setItem('uniportal_token', FAKE_JWT)

    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user?.ra).toBe('2024001')
    expect(result.current.token).toBe(FAKE_JWT)
  })
})
