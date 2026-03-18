require('dotenv').config()

const express      = require('express')
const cors         = require('cors')
const mongoose     = require('mongoose')
const sensorRoutes = require('./routes/sensorRoutes')
const logRoutes    = require('./routes/logRoutes')
const authRoutes   = require('./routes/authRoutes')
const { startSensorLoop } = require('./controllers/sensorController')

const app       = express()
const PORT      = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

// ✅ CORS must be first — only once — before all routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://smartagri2.vercel.app'
  ],
  credentials: true
}))

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
    startSensorLoop()
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((error) => {
    console.warn('MongoDB connect failed, running without DB:', error.message)
    startSensorLoop()
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (no DB)`))
  })