import { useState, useEffect, useCallback } from 'react'
import './Main.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getToken() {
  return localStorage.getItem('token') || ''
}

async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export default function Main() {
  const [sensorData,   setSensorData]   = useState(null)
  const [alerts,       setAlerts]       = useState([])
  const [logs,         setLogs]         = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [lastUpdated,  setLastUpdated]  = useState(null)
  const [addingLog,    setAddingLog]    = useState(false)
  const [sentAlerts,   setSentAlerts]   = useState({})
  const [sendingAlert, setSendingAlert] = useState({})
  const [toastMsg,     setToastMsg]     = useState(null)

  function showToast(msg, kind = 'success') {
    setToastMsg({ msg, kind })
    setTimeout(() => setToastMsg(null), 4000)
  }

  const fetchAll = useCallback(async () => {
    try {
      setError(null)
      const [sensorRes, alertRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/api/sensors`).then(r => { if (!r.ok) throw new Error(`Sensors: ${r.status}`); return r.json() }),
        fetch(`${API_BASE}/api/sensors/alerts`).then(r => { if (!r.ok) throw new Error(`Alerts: ${r.status}`); return r.json() }),
        authFetch(`${API_BASE}/api/logs`),
      ])
      setSensorData(sensorRes)
      setAlerts(alertRes.alerts || [])
      setLogs(logRes.logs || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 5000)
    return () => clearInterval(interval)
  }, [fetchAll])

  async function handleSendWhatsApp(alert) {
    const { type, message, severity } = alert
    setSendingAlert(prev => ({ ...prev, [type]: true }))
    try {
      const data = await authFetch(`${API_BASE}/api/alerts/whatsapp`, {
        method: 'POST',
        body: JSON.stringify({ type, message, severity }),
      })
      if (data.success) {
        setSentAlerts(prev => ({ ...prev, [type]: true }))
        showToast(`✅ WhatsApp alert sent!`, 'success')
        setTimeout(() => setSentAlerts(prev => ({ ...prev, [type]: false })), 5 * 60 * 1000)
      }
    } catch (err) {
      const msg = err.message.includes('429')
        ? '⏳ Cooldown active — alert already sent recently.'
        : `❌ Failed to send: ${err.message}`
      showToast(msg, 'error')
    } finally {
      setSendingAlert(prev => ({ ...prev, [type]: false }))
    }
  }

  async function handleAddLog() {
    setAddingLog(true)
    try {
      await authFetch(`${API_BASE}/api/logs`, { method: 'POST', body: JSON.stringify({}) })
      await fetchAll()
      showToast('✅ Irrigation logged!', 'success')
    } catch (err) {
      showToast('❌ Failed: ' + err.message, 'error')
    } finally {
      setAddingLog(false)
    }
  }

  if (loading) return (
    <div className="main-page-container">
      <div className="state-screen">
        <div className="loading-spinner" />
        <p>Connecting to sensors...</p>
      </div>
    </div>
  )

  if (error && !sensorData) return (
    <div className="main-page-container">
      <div className="state-screen">
        <div className="error-icon">⚠️</div>
        <h3>Failed to load dashboard</h3>
        <p className="error-msg">{error}</p>
        <button className="retry-btn" onClick={fetchAll}>Retry</button>
      </div>
    </div>
  )

  const current = sensorData?.current || {}
  const weather = current.weather || {}

  return (
    <div className="main-page-container">
      <div className="main-page">

        {/* ── Toast ── */}
        {toastMsg && (
          <div className={`toast-notification ${toastMsg.kind}`}>
            {toastMsg.msg}
          </div>
        )}

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <h1>Smart Agriculture Dashboard</h1>
            <p>Auto-refreshes every 5 seconds from live sensors.</p>
          </div>
          <div className="header-right">
            {lastUpdated && <span className="last-updated">Updated {lastUpdated.toLocaleTimeString()}</span>}
            <div className="live-badge"><span className="live-dot" />Live</div>
          </div>
        </div>

        {error && <div className="error-banner">⚠️ Could not refresh — showing last known data</div>}

        {/* ── Summary Cards ── */}
        <div className="summary-grid">
          <div className="summary-card moisture">
            <span className="card-icon">💧</span>
            <label>Soil Moisture</label>
            <div className="big-value">{current.moisture ?? '—'}<span>%</span></div>
            <div className="progress-bar"><div className="progress-fill green" style={{ width: `${current.moisture ?? 0}%` }} /></div>
          </div>
          <div className="summary-card temp">
            <span className="card-icon">🌡</span>
            <label>Temperature</label>
            <div className="big-value">{current.temperature ?? '—'}<span>°C</span></div>
            <div className="progress-bar"><div className="progress-fill orange" style={{ width: `${((current.temperature ?? 0) / 45) * 100}%` }} /></div>
          </div>
          <div className="summary-card humid">
            <span className="card-icon">🌫</span>
            <label>Humidity</label>
            <div className="big-value">{current.humidity ?? '—'}<span>%</span></div>
            <div className="progress-bar"><div className="progress-fill blue" style={{ width: `${current.humidity ?? 0}%` }} /></div>
          </div>
        </div>

        {/* ── Weather ── */}
        <section className="dash-section">
          <h2><span>🌤</span> Weather Overview</h2>
          <div className="weather-grid">
            <div className="info-card"><label>Condition</label><div className="info-value">{weather.condition ?? '—'}</div></div>
            <div className="info-card"><label>Wind Speed</label><div className="info-value">{weather.windSpeed ? Number(weather.windSpeed).toFixed(1) : '—'}<span> km/h</span></div></div>
            <div className="info-card"><label>Forecast</label><div className="info-value">{weather.forecast ?? '—'}</div></div>
            <div className="info-card"><label>Last Reading</label><div className="info-value timestamp">{current.timestamp ? new Date(current.timestamp).toLocaleTimeString() : '—'}</div></div>
          </div>
        </section>

        {/* ── Alerts + WhatsApp ── */}
        <section className="dash-section">
          <div className="section-header">
            <h2>
              <span>🔔</span> Active Alerts
              {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
            </h2>
            {alerts.length > 1 && (
              <button
                className="send-all-btn"
                onClick={() => alerts.forEach(a => {
                  if (!sentAlerts[a.type] && !sendingAlert[a.type]) handleSendWhatsApp(a)
                })}
              >
                📲 Send All to WhatsApp
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="no-alerts">✅ All systems normal — no active alerts</div>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert, i) => (
                <div key={i} className={`alert-item ${alert.severity}`}>
                  <span className="alert-dot" />
                  <div className="alert-body">
                    <span className="alert-msg">{alert.message}</span>
                    <span className="alert-type-label">{alert.type}</span>
                  </div>
                  <span className="alert-severity">{alert.severity}</span>
                  <button
                    className={`whatsapp-btn ${sentAlerts[alert.type] ? 'sent' : ''}`}
                    onClick={() => handleSendWhatsApp(alert)}
                    disabled={sendingAlert[alert.type] || sentAlerts[alert.type]}
                    title={sentAlerts[alert.type] ? '5 min cooldown active' : 'Send to WhatsApp'}
                  >
                    {sendingAlert[alert.type]
                      ? <span className="btn-spinner" />
                      : sentAlerts[alert.type]
                        ? '✅ Sent'
                        : '📲 WhatsApp'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Irrigation Logs ── */}
        <section className="dash-section">
          <div className="section-header">
            <h2><span>🚿</span> Irrigation Logs</h2>
            <button className="irrigate-btn" onClick={handleAddLog} disabled={addingLog}>
              {addingLog ? 'Logging...' : '+ Log Irrigation'}
            </button>
          </div>
          {logs.length === 0 ? (
            <div className="no-alerts">No irrigation logs yet.</div>
          ) : (
            <div className="logs-table-wrap">
              <table className="logs-table">
                <thead><tr><th>Date & Time</th><th>Duration</th><th>Water Used</th></tr></thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i}>
                      <td>{new Date(log.date).toLocaleString()}</td>
                      <td>{log.duration} min</td>
                      <td>{log.waterUsed} L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}