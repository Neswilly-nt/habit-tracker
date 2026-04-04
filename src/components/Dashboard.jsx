import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiLogOut, FiTrendingUp, FiMoon, FiSun } from 'react-icons/fi'  // Enlever FiBell
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import HabitCard from './HabitCard'
import AddHabitModal from './AddHabitModal'
import Statistics from './Statistics'
// import { useReminder } from '../hooks/useReminder'  <- À SUPPRIMER
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // SUPPRIMER cette ligne
  // const { testSound } = useReminder(habits)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchHabits()
  }, [user])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const fetchHabits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/habits')
      setHabits(response.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des habitudes', {
        style: {
          background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleHabit = async (habitId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/habits/${habitId}/toggle`)
      setHabits(habits.map(h => h._id === habitId ? response.data : h))
      
      const habit = habits.find(h => h._id === habitId)
      if (response.data.stats.todayCompleted) {
        toast.success(`${habit.name} complété !`, {
          icon: '✓',
          style: {
            background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            color: isDark ? '#fff' : '#000',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          },
        })
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour', {
        style: {
          background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        },
      })
    }
  }

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/habits/${habitId}`)
        setHabits(habits.filter(h => h._id !== habitId))
        toast.success('Habitude supprimée', {
          style: {
            background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            color: isDark ? '#fff' : '#000',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          },
        })
      } catch (error) {
        toast.error('Erreur lors de la suppression', {
          style: {
            background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            color: isDark ? '#fff' : '#000',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          },
        })
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-neutral-400/30 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
          <div className="absolute inset-0 -z-10">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header - SANS le bouton de test son */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`backdrop-blur-xl ${
            isDark 
              ? 'bg-neutral-900/40 border-neutral-800/50' 
              : 'bg-white/40 border-neutral-200/50'
          } border rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              <span className="font-bold">HABIT</span>
              <span className="text-neutral-400 dark:text-neutral-600 mx-2">·</span>
              <span className="text-neutral-600 dark:text-neutral-400">{user?.name}</span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-500 text-xs md:text-sm mt-1 font-light">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            {/* Bouton thème */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className={`flex-1 md:flex-none p-2 md:p-3 rounded-xl backdrop-blur-md border transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50'
                  : 'bg-white/50 border-neutral-200/50 text-neutral-700 hover:bg-white/80'
              }`}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              <span className="text-xs md:hidden">{isDark ? 'Clair' : 'Sombre'}</span>
            </motion.button>

            {/* Bouton statistiques */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className={`flex-1 md:flex-none p-2 md:p-3 rounded-xl backdrop-blur-md border transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50'
                  : 'bg-white/50 border-neutral-200/50 text-neutral-700 hover:bg-white/80'
              }`}
            >
              <FiTrendingUp size={18} />
              <span className="text-xs md:hidden">Stats</span>
            </motion.button>
            
            {/* Bouton déconnexion */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`flex-1 md:flex-none p-2 md:p-3 rounded-xl backdrop-blur-md border transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:bg-neutral-700/50 hover:text-white'
                  : 'bg-white/50 border-neutral-200/50 text-neutral-600 hover:bg-white/80 hover:text-neutral-900'
              }`}
            >
              <FiLogOut size={18} />
              <span className="text-xs md:hidden">Déconnexion</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Statistiques */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Statistics habits={habits} isDark={isDark} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des habitudes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence>
            {habits.map((habit, index) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                index={index}
                isDark={isDark}
                onToggle={handleToggleHabit}
                onDelete={handleDeleteHabit}
                onViewStats={() => {
                  setSelectedHabit(habit)
                  setShowStats(true)
                }}
              />
            ))}
          </AnimatePresence>

          {/* Carte d'ajout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: habits.length * 0.1 }}
            onClick={() => setShowAddModal(true)}
            className={`backdrop-blur-xl border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px] md:min-h-[280px] cursor-pointer group transition-all ${
              isDark
                ? 'bg-neutral-900/30 border-neutral-800/50 hover:bg-neutral-900/50'
                : 'bg-white/30 border-neutral-200/50 hover:bg-white/50'
            }`}
          >
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
              isDark
                ? 'bg-neutral-800/50'
                : 'bg-neutral-200/50'
            }`}>
              <FiPlus size={24} className={isDark ? 'text-neutral-400' : 'text-neutral-600'} />
            </div>
            <p className={`text-sm md:text-base font-light ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Nouvelle habitude
            </p>
            <div className="glass-divider mt-4" />
          </motion.div>
        </div>

        {/* Message si aucune habitude */}
        {habits.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg font-light ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Vous n'avez pas encore d'habitude
            </p>
            <p className={`text-sm font-light mt-2 ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
              Cliquez sur "Nouvelle habitude" pour commencer
            </p>
          </motion.div>
        )}

        {/* Modal d'ajout */}
        <AddHabitModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onHabitAdded={() => {
            fetchHabits()
            setShowAddModal(false)
          }}
          isDark={isDark}
        />
      </div>
    </div>
  )
}

export default Dashboard
