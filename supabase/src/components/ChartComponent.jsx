import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function ChartComponent({ label, dataPoints, borderColor }) {
  const data = {
    labels: dataPoints.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label,
        data: dataPoints.map((d) => d.value),
        borderColor,
        backgroundColor: borderColor,
        tension: 0.3,
        pointRadius: 2,
        fill: false
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className="chart-wrapper">
      <Line data={data} options={options} />
    </div>
  )
}
