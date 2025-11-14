
import React, { useEffect, useState } from 'react'
import { addVital, listVitals, vitalsSummary } from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

export default function Vitals({ token, patient }) {
  const [form, setForm] = useState({ heart_rate:'', systolic:'', diastolic:'', temperature:'', glucose:'' })
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(()=>{
    if (!patient) return
    ;(async ()=>{
      const r = await listVitals(token, patient.id)
      setRows(r.reverse())
      const s = await vitalsSummary(token, patient.id)
      setSummary(s)
    })()
  }, [patient, token])

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) return
    const payload = {
      patient_id: patient.id,
      heart_rate: form.heart_rate? Number(form.heart_rate): null,
      systolic: form.systolic? Number(form.systolic): null,
      diastolic: form.diastolic? Number(form.diastolic): null,
      temperature: form.temperature? Number(form.temperature): null,
      glucose: form.glucose? Number(form.glucose): null
    }
    await addVital(token, payload)
    const r = await listVitals(token, patient.id)
    setRows(r.reverse())
    const s = await vitalsSummary(token, patient.id)
    setSummary(s)
    setForm({ heart_rate:'', systolic:'', diastolic:'', temperature:'', glucose:'' })
  }

  return (
    <div>
      <h3>Vitals {patient ? `— ${patient.name}` : ''}</h3>
      {!patient ? <div>Select a patient</div> : (
        <>
          <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, marginBottom:12}}>
            <input placeholder="HR" value={form.heart_rate} onChange={e=>setForm({...form, heart_rate:e.target.value})}/>
            <input placeholder="Sys" value={form.systolic} onChange={e=>setForm({...form, systolic:e.target.value})}/>
            <input placeholder="Dia" value={form.diastolic} onChange={e=>setForm({...form, diastolic:e.target.value})}/>
            <input placeholder="Temp" value={form.temperature} onChange={e=>setForm({...form, temperature:e.target.value})}/>
            <input placeholder="Glucose" value={form.glucose} onChange={e=>setForm({...form, glucose:e.target.value})}/>
            <button type="submit">Add</button>
          </form>

          <div style={{height:320, border:'1px solid #eee', borderRadius:8, padding:8, marginBottom:12}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="heart_rate" name="HR" />
                <Line dataKey="systolic" name="Sys" />
                <Line dataKey="diastolic" name="Dia" />
                <Line dataKey="temperature" name="Temp" />
                <Line dataKey="glucose" name="Glucose" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {summary && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
              <div style={{border:'1px solid #eee', borderRadius:8, padding:8}}>
                <b>Averages</b>
                <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(summary.averages, null, 2)}</pre>
              </div>
              <div style={{border:'1px solid #eee', borderRadius:8, padding:8}}>
                <b>Last Reading</b>
                <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(summary.last_reading, null, 2)}</pre>
              </div>
              <div style={{border:'1px solid #eee', borderRadius:8, padding:8}}>
                <b>Flags</b>
                <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(summary.abnormal_flags, null, 2)}</pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
