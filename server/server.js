// server.js
require('dotenv').config()

const express    = require('express')
const cors       = require('cors')
const mongoose   = require('mongoose')
const sensorRoutes = require('./routes/sensorRoutes')
const logRoutes    = require('./routes/logRoutes')
const authRoutes   = require('./routes/authRoutes')

// ✅ Import the start function — NOT the auto-running controller
const { startSensorLoop } = require('./controllers/sensorController')

const app      = express()
const PORT     = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

app.use('/api/auth',    authRoutes)
app.use('/api/sensors', sensorRoutes)
app.use('/api/logs',    logRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')

    // ✅ Start sensor loop ONLY after DB is ready
    startSensorLoop()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.warn('MongoDB connect failed, running without DB:', error.message)

    // Start without DB (in-memory only)
    startSensorLoop()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (no DB)`)
    })
  })