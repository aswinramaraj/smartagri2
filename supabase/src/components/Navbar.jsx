import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('smartagri_token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="brand">Smart Agri</div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          Dashboard
        </NavLink>
        <NavLink to="/logs" className={({ isActive }) => (isActive ? 'active' : '')}>
          Logs
        </NavLink>
        <button onClick={handleLogout} className="primary-btn" style={{ marginLeft: 14, background: '#f44336' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}
