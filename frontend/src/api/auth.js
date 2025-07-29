const API = import.meta.env.VITE_API_URL

export async function login({ username, password }) {
  const resp = await fetch(`${API}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!resp.ok) throw new Error('Login failed')
  return resp.json()   // returns { access, refresh }
}

export async function register({ username, email, homepage, password }) {
  const resp = await fetch(`${API}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, homepage, password }),
  })
  if (!resp.ok) throw new Error('Registration failed')
  return resp.json()
}