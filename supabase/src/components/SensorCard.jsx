export default function SensorCard({ title, value, unit, color }) {
  return (
    <div className="sensor-card" style={{ borderColor: color }}>
      <div className="sensor-title">{title}</div>
      <div className="sensor-value">{value} {unit}</div>
    </div>
  )
}
