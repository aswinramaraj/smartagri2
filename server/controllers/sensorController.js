// // controllers/sensorController.js
// const twilio = require('twilio')

// // ── Twilio setup ─────────────────────────────────────────────────
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// )

// const FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
// const TO   = process.env.ALERT_WHATSAPP_TO   || 'whatsapp:+919025958422'

// // ── Cooldown: prevent same alert spamming every 4s ───────────────
// // Each alert type has a 10-minute cooldown
// const COOLDOWN_MS = 10 * 60 * 1000 // 10 minutes
// const sentAlertTimes = {} // { [alertType]: timestamp }

// function canSendAlert(type) {
//   const last = sentAlertTimes[type]
//   if (!last) return true
//   return Date.now() - last > COOLDOWN_MS
// }

// function markAlertSent(type) {
//   sentAlertTimes[type] = Date.now()
// }

// // ── Send WhatsApp message ─────────────────────────────────────────
// async function sendWhatsAppAlert(type, message, severity) {
//   if (!canSendAlert(type)) {
//     const remainingMin = Math.ceil(
//       (COOLDOWN_MS - (Date.now() - sentAlertTimes[type])) / 1000 / 60
//     )
//     console.log(`[Twilio] Skipping "${type}" — cooldown active (${remainingMin} min left)`)
//     return
//   }

//   const severityEmoji = {
//     danger:  '🚨',
//     warning: '⚠️',
//     info:    'ℹ️',
//   }[severity] || '🔔'

//   const body = [
//     `${severityEmoji} *Smart Agri Alert*`,
//     ``,
//     `*Alert:* ${message}`,
//     `*Severity:* ${severity.toUpperCase()}`,
//     `*Time:* ${new Date().toLocaleString()}`,
//     ``,
//     `_Check your dashboard for details._`
//   ].join('\n')

//   try {
//     const msg = await client.messages.create({ from: FROM, to: TO, body })
//     markAlertSent(type)
//     console.log(`[Twilio] ✅ WhatsApp sent for "${type}" | SID: ${msg.sid}`)
//   } catch (err) {
//     console.error(`[Twilio] ❌ Failed to send "${type}":`, err.message)
//   }
// }

// // ── Sensor data ───────────────────────────────────────────────────
// const SENSOR_HISTORY_LENGTH = 20

// let currentSensorData = {
//   moisture:    55,
//   temperature: 26,
//   humidity:    60,
//   weather: {
//     condition: 'Sunny',
//     windSpeed: 8,
//     forecast:  'Clear'
//   },
//   timestamp: new Date()
// }

// let sensorHistory = []

// // ── Generate new sensor reading ───────────────────────────────────
// function generateSensorData() {
//   const moisture    = Math.max(10,  Math.min(100, currentSensorData.moisture    + (Math.random() * 8  - 4)))
//   const temperature = Math.max(10,  Math.min(45,  currentSensorData.temperature + (Math.random() * 2  - 1)))
//   const humidity    = Math.max(15,  Math.min(95,  currentSensorData.humidity    + (Math.random() * 5  - 2.5)))

//   const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Light Rain', 'Clear']
//   const weather = {
//     condition: conditions[Math.floor(Math.random() * conditions.length)],
//     windSpeed:  Math.random() * 20,
//     forecast:   conditions[Math.floor(Math.random() * conditions.length)]
//   }

//   const newReading = {
//     moisture:    Number(moisture.toFixed(1)),
//     temperature: Number(temperature.toFixed(1)),
//     humidity:    Number(humidity.toFixed(1)),
//     weather,
//     timestamp:   new Date()
//   }

//   currentSensorData = newReading
//   sensorHistory.unshift(newReading)
//   if (sensorHistory.length > SENSOR_HISTORY_LENGTH) sensorHistory.pop()

//   // ── Auto-check alerts and send WhatsApp ───────────────────────
//   checkAndSendAlerts(newReading)
// }

// // ── Check all alert conditions and auto-send WhatsApp ─────────────
// function checkAndSendAlerts(data) {
//   const windSpeed = Number(data.weather?.windSpeed ?? 0)
//   const forecast  = String(data.weather?.forecast  ?? '').toLowerCase()

//   // 1. Low Moisture
//   if (data.moisture < 30) {
//     sendWhatsAppAlert(
//       'low-moisture',
//       `Soil moisture is critically low at ${data.moisture}%`,
//       'warning'
//     )
//   }

//   // 2. High Temperature
//   if (data.temperature > 35) {
//     sendWhatsAppAlert(
//       'high-temperature',
//       `Temperature is dangerously high at ${data.temperature}°C`,
//       'danger'
//     )
//   }

//   // 3. High Wind
//   if (windSpeed > 12) {
//     sendWhatsAppAlert(
//       'high-wind',
//       `High wind detected at ${windSpeed.toFixed(1)} km/h`,
//       'warning'
//     )
//   }

//   // 4. Rain Forecast
//   if (forecast.includes('rain')) {
//     sendWhatsAppAlert(
//       'rain-forecast',
//       `Rain forecasted — consider delaying irrigation`,
//       'info'
//     )
//   }

//   // 5. Waterlogging Risk
//   if (forecast.includes('rain') && data.moisture > 85) {
//     sendWhatsAppAlert(
//       'waterlogging-risk',
//       `Waterlogging risk! Rain expected and moisture is ${data.moisture}%`,
//       'warning'
//     )
//   }
// }

// // ── Create initial history ────────────────────────────────────────
// for (let i = 0; i < SENSOR_HISTORY_LENGTH; i++) {
//   generateSensorData()
// }

// // ── Run every 4 seconds (same as before) ─────────────────────────
// setInterval(generateSensorData, 4000)

// // ── API Handlers ──────────────────────────────────────────────────
// function getSensors(req, res) {
//   res.json({
//     current: currentSensorData,
//     history: sensorHistory
//   })
// }

// function getAlerts(req, res) {
//   const alerts = []

//   if (currentSensorData.moisture < 30) {
//     alerts.push({ type: 'low-moisture', message: 'Low Moisture Alert', severity: 'warning' })
//   }

//   if (currentSensorData.temperature > 35) {
//     alerts.push({ type: 'high-temperature', message: 'High Temperature Alert', severity: 'danger' })
//   }

//   const windSpeed = Number(currentSensorData.weather?.windSpeed ?? 0)
//   const forecast  = String(currentSensorData.weather?.forecast  ?? '').toLowerCase()

//   if (windSpeed > 12) {
//     alerts.push({
//       type: 'high-wind',
//       message: `High Wind Alert (${windSpeed.toFixed(1)} km/h)`,
//       severity: 'warning'
//     })
//   }

//   if (forecast.includes('rain')) {
//     alerts.push({
//       type: 'rain-forecast',
//       message: 'Rain Forecast: consider delaying irrigation',
//       severity: 'info'
//     })
//   }

//   if (forecast.includes('rain') && currentSensorData.moisture > 85) {
//     alerts.push({
//       type: 'waterlogging-risk',
//       message: 'Waterlogging Risk: rain expected and soil moisture is already high',
//       severity: 'warning'
//     })
//   }

//   res.json({ alerts, at: new Date() })
// }

// module.exports = { getSensors, getAlerts }



// controllers/sensorController.js
const twilio        = require('twilio')
const SensorReading = require('../models/sensorReading')

// ── Twilio setup ──────────────────────────────────────────────────
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
const TO   = process.env.ALERT_WHATSAPP_TO   || 'whatsapp:+919025958422'

// ── Pause flag ────────────────────────────────────────────────────
let whatsappPaused = false

function pauseAlerts(req, res) {
  whatsappPaused = true
  console.log('[Twilio] ⏸ WhatsApp alerts PAUSED')
  res.json({ success: true, status: 'paused' })
}

function resumeAlerts(req, res) {
  whatsappPaused = false
  console.log('[Twilio] ▶️  WhatsApp alerts RESUMED')
  res.json({ success: true, status: 'resumed' })
}

function getAlertStatus(req, res) {
  res.json({ paused: whatsappPaused })
}

// ── Cooldown ──────────────────────────────────────────────────────
const COOLDOWN_MS    = 10 * 60 * 1000
const sentAlertTimes = {}

function canSendAlert(type) {
  const last = sentAlertTimes[type]
  if (!last) return true
  return Date.now() - last > COOLDOWN_MS
}

function markAlertSent(type) {
  sentAlertTimes[type] = Date.now()
}

// ── Send WhatsApp ─────────────────────────────────────────────────
async function sendWhatsAppAlert(type, message, severity) {
  if (whatsappPaused) {
    console.log(`[Twilio] ⏸ Skipping "${type}" — alerts are paused`)
    return
  }

  if (!canSendAlert(type)) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - sentAlertTimes[type])) / 1000 / 60)
    console.log(`[Twilio] Skipping "${type}" — cooldown active (${remaining} min left)`)
    return
  }

  const severityEmoji = { danger: '🚨', warning: '⚠️', info: 'ℹ️' }[severity] || '🔔'

  const body = [
    `${severityEmoji} *Smart Agri Alert*`,
    ``,
    `*Alert:* ${message}`,
    `*Severity:* ${severity.toUpperCase()}`,
    `*Time:* ${new Date().toLocaleString()}`,
    ``,
    `_Check your dashboard for details._`
  ].join('\n')

  try {
    const msg = await client.messages.create({ from: FROM, to: TO, body })
    markAlertSent(type)
    console.log(`[Twilio] ✅ WhatsApp sent for "${type}" | SID: ${msg.sid}`)
  } catch (err) {
    console.error(`[Twilio] ❌ Failed to send "${type}":`, err.message)
  }
}

// ── In-memory store (fallback if DB is down) ──────────────────────
const HISTORY_LENGTH = 20
let currentSensorData = {
  moisture: 55, temperature: 26, humidity: 60,
  weather: { condition: 'Sunny', windSpeed: 8, forecast: 'Clear' },
  timestamp: new Date()
}
let sensorHistory = []

// ── Build alerts array from a reading ────────────────────────────
function buildAlerts(data) {
  const alerts    = []
  const windSpeed = Number(data.weather?.windSpeed ?? 0)
  const forecast  = String(data.weather?.forecast  ?? '').toLowerCase()

  if (data.moisture < 30)
    alerts.push({ type: 'low-moisture',      message: `Soil moisture critically low at ${data.moisture}%`,          severity: 'warning' })

  if (data.temperature > 35)
    alerts.push({ type: 'high-temperature',  message: `Temperature dangerously high at ${data.temperature}°C`,      severity: 'danger'  })

  if (windSpeed > 12)
    alerts.push({ type: 'high-wind',         message: `High wind detected at ${windSpeed.toFixed(1)} km/h`,         severity: 'warning' })

  if (forecast.includes('rain'))
    alerts.push({ type: 'rain-forecast',     message: `Rain forecasted — consider delaying irrigation`,             severity: 'info'    })

  if (forecast.includes('rain') && data.moisture > 85)
    alerts.push({ type: 'waterlogging-risk', message: `Waterlogging risk! Rain expected and moisture is ${data.moisture}%`, severity: 'warning' })

  return alerts
}

// ── Save reading to MongoDB ───────────────────────────────────────
async function saveReadingToDB(reading) {
  try {
    await SensorReading.create(reading)
    console.log(`[DB] ✅ Saved reading — moisture:${reading.moisture}% temp:${reading.temperature}°C`)
  } catch (err) {
    console.warn('[DB] ⚠️ Could not save reading:', err.message)
  }
}

// ── Generate new sensor reading every 4s ─────────────────────────
async function generateSensorData() {
  const moisture    = Math.max(10,  Math.min(100, currentSensorData.moisture    + (Math.random() * 8  - 4)))
  const temperature = Math.max(10,  Math.min(45,  currentSensorData.temperature + (Math.random() * 2  - 1)))
  const humidity    = Math.max(15,  Math.min(95,  currentSensorData.humidity    + (Math.random() * 5  - 2.5)))

  const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Light Rain', 'Clear']
  const weather = {
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    windSpeed:  Math.random() * 20,
    forecast:   conditions[Math.floor(Math.random() * conditions.length)]
  }

  const alerts = buildAlerts({ moisture, temperature, humidity, weather })

  const newReading = {
    moisture:    Number(moisture.toFixed(1)),
    temperature: Number(temperature.toFixed(1)),
    humidity:    Number(humidity.toFixed(1)),
    weather,
    alerts,
    timestamp:   new Date()
  }

  // Update in-memory store
  currentSensorData = newReading
  sensorHistory.unshift(newReading)
  if (sensorHistory.length > HISTORY_LENGTH) sensorHistory.pop()

  // ✅ Save to MongoDB
  await saveReadingToDB(newReading)

  // ✅ Auto-send WhatsApp for each active alert
  for (const alert of alerts) {
    await sendWhatsAppAlert(alert.type, alert.message, alert.severity)
  }
}

// ── Seed initial history ──────────────────────────────────────────
// ✅ Replace with this exported function
async function startSensorLoop() {
  console.log('[Sensor] Starting sensor loop...')

  // Generate initial history
  for (let i = 0; i < HISTORY_LENGTH; i++) {
    await generateSensorData()
  }

  console.log('[Sensor] ✅ Initial history generated')

  // Start polling every 4 seconds
  setInterval(generateSensorData, 4000)
}

// ── API: GET /api/sensors ─────────────────────────────────────────
async function getSensors(req, res) {
  try {
    // Try to get latest 20 readings from MongoDB
    const dbHistory = await SensorReading
      .find()
      .sort({ timestamp: -1 })
      .limit(20)
      .lean()

    if (dbHistory && dbHistory.length > 0) {
      return res.json({
        current: dbHistory[0],
        history: dbHistory
      })
    }
  } catch (err) {
    console.warn('[DB] Falling back to in-memory for getSensors:', err.message)
  }

  // Fallback to in-memory
  res.json({ current: currentSensorData, history: sensorHistory })
}

// ── API: GET /api/sensors/alerts ──────────────────────────────────
function getAlerts(req, res) {
  const alerts = buildAlerts(currentSensorData)
  res.json({ alerts, at: new Date() })
}

// ── API: GET /api/sensors/history ────────────────────────────────
// Get all readings from DB with optional ?limit=50&from=&to= filters
async function getHistory(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100
    const query = {}

    if (req.query.from || req.query.to) {
      query.timestamp = {}
      if (req.query.from) query.timestamp.$gte = new Date(req.query.from)
      if (req.query.to)   query.timestamp.$lte = new Date(req.query.to)
    }

    const readings = await SensorReading
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()

    res.json({
      count: readings.length,
      readings
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history', details: err.message })
  }
}

// ── API: GET /api/sensors/stats ───────────────────────────────────
// Average, min, max of all stored readings
async function getStats(req, res) {
  try {
    const stats = await SensorReading.aggregate([
      {
        $group: {
          _id: null,
          avgMoisture:    { $avg: '$moisture'    },
          avgTemperature: { $avg: '$temperature' },
          avgHumidity:    { $avg: '$humidity'    },
          minMoisture:    { $min: '$moisture'    },
          maxMoisture:    { $max: '$moisture'    },
          minTemperature: { $min: '$temperature' },
          maxTemperature: { $max: '$temperature' },
          minHumidity:    { $min: '$humidity'    },
          maxHumidity:    { $max: '$humidity'    },
          totalReadings:  { $sum: 1              }
        }
      }
    ])

    res.json(stats[0] || { message: 'No data yet' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats', details: err.message })
  }
}

module.exports = {
  getSensors,
  getAlerts,
  getHistory,
  getStats,
  pauseAlerts,
  resumeAlerts,
  getAlertStatus,
  startSensorLoop 
}