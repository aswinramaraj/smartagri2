import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SmartSaveLogin from '../pages/login'
import Logs from '../pages/Logs'
import Main from '../pages/Main'
import Dashboard from '../pages/Dashboard'

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<SmartSaveLogin />} />
            <Route path='/logs' element={<Logs />} />
            <Route path='/main' element={<Main />} />
            <Route path='/dashboard' element={<Dashboard />} />

            <Route path='*' element={<SmartSaveLogin />} />
        </Routes>
    </Router>
  )
}

export default AppRouter