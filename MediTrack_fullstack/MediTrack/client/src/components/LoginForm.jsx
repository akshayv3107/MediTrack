
import React, { useState } from 'react'
import { login, register } from '../api'

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('demo@demo.com')
  const [password, setPassword] = useState('Passw0rd!')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const token = await login(email, password)
      onLogin(token)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(email, password)
      const token = await login(email, password)
      onLogin(token)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <form style={{display:'grid', gap:8, maxWidth:420, margin:'48px auto'}} onSubmit={handleLogin}>
      <h3>Login to MediTrack</h3>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
      <div style={{display:'flex', gap:8}}>
        <button type="submit">Login</button>
        <button onClick={handleRegister} type="button">Register</button>
      </div>
      {error && <div style={{color:'crimson'}}>{error}</div>}
    </form>
  )
}
