
const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000'

export async function login(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email, password})
  })
  if (!r.ok) throw new Error('Invalid credentials')
  const data = await r.json()
  return data.access_token
}

export async function register(email, password) {
  const r = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email, password})
  })
  if (!r.ok) throw new Error('Registration failed')
  return r.json()
}

export async function listPatients(token) {
  const r = await fetch(`${BASE}/patients`, { headers: { Authorization: `Bearer ${token}` } })
  if (!r.ok) throw new Error('Failed to fetch patients')
  return r.json()
}

export async function createPatient(token, payload) {
  const r = await fetch(`${BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  if (!r.ok) throw new Error('Failed to create patient')
  return r.json()
}

export async function listVitals(token, patientId, start, end) {
  const params = new URLSearchParams()
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  const r = await fetch(`${BASE}/vitals/${patientId}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!r.ok) throw new Error('Failed to fetch vitals')
  return r.json()
}

export async function addVital(token, payload) {
  const r = await fetch(`${BASE}/vitals`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  if (!r.ok) throw new Error('Failed to add vital')
  return r.json()
}

export async function vitalsSummary(token, patientId) {
  const r = await fetch(`${BASE}/vitals/summary/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!r.ok) throw new Error('Failed to fetch summary')
  return r.json()
}
