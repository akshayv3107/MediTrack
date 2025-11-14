
import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import Patients from './components/Patients'
import Vitals from './components/Vitals'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [selectedPatient, setSelectedPatient] = useState(null)

  const onLogin = (tok) => {
    localStorage.setItem('token', tok)
    setToken(tok)
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    setToken('')
  }

  return (
    <div style={{fontFamily:'Inter, system-ui, Arial', padding: 16, maxWidth: 1100, margin: '0 auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>MediTrack Dashboard</h2>
        {token && <button onClick={onLogout}>Logout</button>}
      </header>

      {!token ? (
        <LoginForm onLogin={onLogin}/>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:16}}>
          <div>
            <Patients token={token} onSelect={setSelectedPatient} selected={selectedPatient}/>
          </div>
          <div>
            <Vitals token={token} patient={selectedPatient}/>
          </div>
        </div>
      )}
      <footer style={{marginTop:24, fontSize:12, color:'#666'}}>API base: {import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000'}</footer>
    </div>
  )
}
