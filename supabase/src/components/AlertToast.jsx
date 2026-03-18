export default function AlertToast({ alert, onClose }) {
  if (!alert) return null

  return (
    <div className={`toast ${alert.severity}`}>
      <span>{alert.message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  )
}
