import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import StudentLogin from './components/StudentLogin'
import StudentRegister from './components/StudentRegister'
import Dashboard from './components/Dashboard'
import api from './services/api'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [backendStatus, setBackendStatus] = useState('Connecting...')
  const [studentData, setStudentData] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/api/test')
        setBackendStatus(response.data.message)
      } catch (error) {
        setBackendStatus('Backend connection failed')
      }
    }
    testConnection()
  }, [])

  const handleLogin = (data) => {
    setStudentData(data)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'student-login':
        return <StudentLogin onNavigate={setCurrentPage} onLogin={handleLogin} />
      case 'student-register':
        return <StudentRegister onNavigate={setCurrentPage} onRegister={handleLogin} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} studentData={studentData} />
      default:
        return <LandingPage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  )
}

export default App
