import React from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiTrendingUp, FiCheckCircle, FiTarget } from 'react-icons/fi'

const Statistics = ({ habits, isDark }) => {
  const totalHabits = habits.length
  const completedToday = habits.filter(h => h.stats?.todayCompleted).length
  const totalStreak = habits.reduce((sum, h) => sum + (h.stats?.currentStreak || 0), 0)
  const averageSuccess = habits.reduce((sum, h) => sum + (h.stats?.successRate || 0), 0) / totalHabits || 0

  const stats = [
    {
      icon: FiTarget,
      value: totalHabits,
      label: 'Habitudes',
      delay: 0.1,
    },
    {
      icon: FiCheckCircle,
      value: completedToday,
      label: "Aujourd'hui",
      delay: 0.2,
    },
    {
      icon: FiAward,
      value: totalStreak,
      label: 'Jours cumulés',
      delay: 0.3,
    },
    {
      icon: FiTrendingUp,
      value: `${Math.round(averageSuccess)}%`,
      label: 'Réussite',
      delay: 0.4,
    },
  ]

  return (
    <div className={`backdrop-blur-xl border rounded-2xl p-8 ${
      isDark
        ? 'bg-neutral-900/30 border-neutral-800/50'
        : 'bg-white/30 border-neutral-200/50'
    }`}>
      <h2 className="text-xl font-light mb-8 tracking-tight">
        <span className="font-bold">APERÇU</span>
        <span className="mx-2 text-neutral-400 dark:text-neutral-600">·</span>
        <span className="text-neutral-600 dark:text-neutral-400">Statistiques</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: stat.delay }}
            className="text-center"
          >
            <div className={`inline-flex p-3 rounded-xl mb-3 ${
              isDark ? 'bg-neutral-800/50' : 'bg-neutral-200/50'
            }`}>
              <stat.icon size={24} className={isDark ? 'text-neutral-300' : 'text-neutral-700'} />
            </div>
            <div className="text-3xl font-light mb-1">{stat.value}</div>
            <div className={`text-xs font-light uppercase tracking-wider ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de progression globale */}
      <div className="mt-8 pt-8 border-t border-neutral-200/20 dark:border-neutral-800/20">
        <div className="flex justify-between items-center mb-3">
          <span className={`text-sm font-light ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Progression globale
          </span>
          <span className="text-sm font-light">
            {Math.round(averageSuccess)}%
          </span>
        </div>
        <div className={`h-1 rounded-full overflow-hidden ${
          isDark ? 'bg-neutral-800' : 'bg-neutral-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${averageSuccess}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${
              isDark ? 'bg-white/50' : 'bg-black/50'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default Statistics
