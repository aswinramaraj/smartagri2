import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import SensorCard from '../components/SensorCard'
import ChartComponent from '../components/ChartComponent'
import AlertToast from '../components/AlertToast'
import './dashboard.css'

export default function Dashboard() {
  const [sensor, setSensor] = useState({ current: {}, history: [] })
  const [alerts, setAlerts] = useState([])
  const [toast, setToast] = useState(null)
  const [autoIrrigation, setAutoIrrigation] = useState(false)
  const [loading, setLoading] = useState(true)

  const moistureHistory = useMemo(() => sensor.history.map((s) => ({ timestamp: s.timestamp, value: s.moisture })), [sensor])
  const tempHistory = useMemo(() => sensor.history.map((s) => ({ timestamp: s.timestamp, value: s.temperature })), [sensor])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [sensorRes, alertRes] = await Promise.all([api.get('/sensors'), api.get('/sensors/alerts')])
        setSensor(sensorRes.data)
        setAlerts(alertRes.data.alerts)

        const latestAlert = alertRes.data.alerts?.[0]
        if (latestAlert) setToast(latestAlert)

                // Irrigation-related alerts (client-side because only UI knows autoIrrigation state)
                const moistureNow = sensorRes.data.current.moisture

                // Warn if auto irrigation is ON while soil is already very wet
                if (autoIrrigation && moistureNow > 85) {
                  setToast({
                    type: 'auto-irrigation-wet-guard',
                    message: 'Auto Irrigation is ON while soil moisture is very high (risk of overwatering)',
                    severity: 'warning'
                  })
                }
        
                // When moisture is low and auto irrigation is enabled, try to trigger irrigation (logs endpoint)
                if (autoIrrigation && moistureNow < 30) {
                  // Informational toast that action is being taken
                  setToast({
                    type: 'auto-irrigation-triggered',
                    message: 'Low moisture detected: Auto Irrigation triggered',
                    severity: 'info'
                  })
        
                  try {
                    await api.post('/logs', {})
                  } catch (e) {
                    // If irrigation/logging fails, surface a danger toast
                    setToast({
                      type: 'auto-irrigation-failed',
                      message: 'Auto Irrigation failed (could not log irrigation action)',
                      severity: 'danger'
                    })
                  }
                }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [autoIrrigation])

  return (
    <div className="app-page">
      <Navbar />
      <div className="dashboard">
        <div className="header-row">
          <h1>Smart Agriculture Monitoring</h1>
          <div className="toggle-row">
            <label>
              <input type="checkbox" checked={autoIrrigation} onChange={(e) => setAutoIrrigation(e.target.checked)} />
              Auto Irrigation
            </label>
            <span className="badge">{loading ? 'Loading...' : 'Live'}</span>
          </div>
        </div>

        <div className="cards-grid">
          <SensorCard title="Soil Moisture" value={sensor.current.moisture ?? '-'} unit="%" color="#2D336B" />
          <SensorCard title="Temperature" value={sensor.current.temperature ?? '-'} unit="°C" color="#7886C7" />
          <SensorCard title="Humidity" value={sensor.current.humidity ?? '-'} unit="%" color="#A9B5DF" />
        </div>

        <div className="charts-grid">
          <ChartComponent label="Moisture over Time" dataPoints={moistureHistory} borderColor="#2D336B" />
          <ChartComponent label="Temperature over Time" dataPoints={tempHistory} borderColor="#7886C7" />
        </div>

        <div className="weather-box">
          <h3>Weather (mocked)</h3>
          <p>{sensor.current.weather?.condition || 'N/A'}, Wind {sensor.current.weather?.windSpeed?.toFixed(1) || '-'} km/h</p>
          <p>Forecast: {sensor.current.weather?.forecast || 'N/A'}</p>
        </div>

        <div className="alert-list">
          {alerts.map((a) => (
            <div key={a.type} className={`alert-item ${a.severity}`}>
              {a.message}
            </div>
          ))}
        </div>

        <AlertToast alert={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  )
}

