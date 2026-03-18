import { useEffect, useState } from 'react'
import api from '../utils/api'
import Navbar from '../components/Navbar'

const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000/api'

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [saving, setSaving] = useState(false)

  const loadLogs = async () => {
    try {
      const res = await api.get('/logs')
      setLogs(res.data.logs || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const startIrrigation = async () => {
    setSaving(true)
    try {
      await api.post('/logs', {})
      await loadLogs()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-page">
      <Navbar />
      <div className="logs-page">
        <div className="header-row">
          <h1>Irrigation Logs</h1>
          <button onClick={startIrrigation} disabled={saving} className="primary-btn">
            {saving ? 'Saving...' : 'Start Irrigation'}
          </button>
        </div>

        <table className="log-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Duration (min)</th>
              <th>Water Used (L)</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <tr key={`${log.date}-${idx}`}>
                  <td>{new Date(log.date).toLocaleString()}</td>
                  <td>{log.duration}</td>
                  <td>{log.waterUsed}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No logs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
