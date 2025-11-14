
import React, { useEffect, useState } from 'react'
import { listPatients, createPatient } from '../api'

export default function Patients({ token, onSelect, selected }) {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({ name:'', age:'', gender:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listPatients(token)
      setPatients(data)
      if (!selected && data.length) onSelect(data[0])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const p = await createPatient(token, { ...form, age: form.age ? Number(form.age) : null })
      setForm({ name:'', age:'', gender:'' })
      setPatients([p, ...patients])
      onSelect(p)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div>
      <h3>Patients</h3>
      <form onSubmit={submit} style={{display:'grid', gap:6, marginBottom:12}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})}/>
        <input placeholder="Gender" value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}/>
        <button type="submit">Add Patient</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <ul style={{listStyle:'none', padding:0}}>
          {patients.map(p => (
            <li key={p.id} style={{padding:'6px 8px', marginBottom:6, border:'1px solid #ddd', borderRadius:8, background:selected?.id===p.id?'#eef':'#fff', cursor:'pointer'}}
                onClick={()=>onSelect(p)}>
              {p.name} — {p.gender || 'NA'}, {p.age || 'NA'}
            </li>
          ))}
        </ul>
      )}
      {error && <div style={{color:'crimson'}}>{error}</div>}
    </div>
  )
}
