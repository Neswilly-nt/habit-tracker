import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import IntroAnimation from './components/IntroAnimation'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          {showIntro ? (
            <IntroAnimation />
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                color: '#1f2937',
                border: '1px solid rgba(255,255,255,0.2)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
