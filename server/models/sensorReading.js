// models/sensorReading.js
const mongoose = require('mongoose')

const sensorReadingSchema = new mongoose.Schema({
  moisture:    { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity:    { type: Number, required: true },
  weather: {
    condition: { type: String },
    windSpeed: { type: Number },
    forecast:  { type: String }
  },
  alerts: [
    {
      type:     { type: String },
      message:  { type: String },
      severity: { type: String }
    }
  ],
  timestamp: { type: Date, default: Date.now }
})

// Auto-delete readings older than 7 days (optional)
sensorReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 })

module.exports = mongoose.model('SensorReading', sensorReadingSchema)