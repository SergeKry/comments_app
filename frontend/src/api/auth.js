import client from './client'

const API = import.meta.env.VITE_API_URL

export async function login({ username, password }) {
  const resp = await fetch(`${API}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!resp.ok) throw new Error('Login failed')
  return resp.json()
}

export async function register({ username, email, homepage, password, recaptcha_token }) {
  const resp = await fetch(`${API}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, homepage, password, recaptcha_token }),
  })
  if (!resp.ok) throw new Error('Registration failed')
  return resp.json()
}

export async function logoutAPI() {
  const access  = localStorage.getItem('token')
  const refresh = localStorage.getItem('refresh')
  if (!refresh) return

  const resp = await fetch(`${API}/auth/logout/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access}`,
     },
    body: JSON.stringify({ refresh }),
  })

  if (!resp.ok) {
    throw new Error('Server logout failed')
  }
}

export async function me() {
  const response = await client(`/auth/me/`)
  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Failed to check current user: ${errText}`)
  }
  return response.json()
}

export async function fetchAuthors() {
  const resp = await fetch(`${API}/auth/authors/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!resp.ok) throw new Error('Failed to fetch authors')
  return resp.json()
}