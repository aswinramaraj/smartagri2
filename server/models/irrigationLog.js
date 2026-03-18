const mongoose = require('mongoose')

const irrigationLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // minutes
  waterUsed: { type: Number, required: true } // liters
})

module.exports = mongoose.model('IrrigationLog', irrigationLogSchema)
