import React from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiTrash2, FiTrendingUp, FiClock } from 'react-icons/fi'

const HabitCard = ({ habit, index, isDark, onToggle, onDelete, onViewStats }) => {
  const { stats } = habit
  const todayCompleted = stats?.todayCompleted || false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className={`backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden group transition-all ${
        isDark
          ? 'bg-neutral-900/30 border-neutral-800/50 hover:bg-neutral-900/40'
          : 'bg-white/30 border-neutral-200/50 hover:bg-white/40'
      }`}
    >
      {/* Effet de verre au survol */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-white/5 to-transparent'
          : 'bg-gradient-to-br from-black/5 to-transparent'
      }`} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-neutral-800/50' : 'bg-neutral-200/50'
            }`}>
              {habit.icon}
            </div>
            <div>
              <h3 className="font-medium text-lg">{habit.name}</h3>
              {habit.description && (
                <p className={`text-sm font-light ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {habit.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onViewStats()
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-neutral-800/50 text-neutral-400'
                  : 'hover:bg-neutral-200/50 text-neutral-600'
              }`}
            >
              <FiTrendingUp size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(habit._id)
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-300'
                  : 'hover:bg-neutral-200/50 text-neutral-600 hover:text-neutral-700'
              }`}
            >
              <FiTrash2 size={18} />
            </motion.button>
          </div>
        </div>

        {/* Stats minimalistes */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-light">
              {stats?.currentStreak || 0}
            </div>
            <div className={`text-xs font-light uppercase tracking-wider ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              Jours
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-light">
              {stats?.successRate || 0}%
            </div>
            <div className={`text-xs font-light uppercase tracking-wider ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              Réussite
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-light">
              {stats?.totalCompletions || 0}
            </div>
            <div className={`text-xs font-light uppercase tracking-wider ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              Total
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200/20 dark:border-neutral-800/20">
          <div className={`flex items-center gap-2 text-sm font-light ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}>
            <FiClock size={14} />
            <span>{habit.reminderTime}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(habit._id)
            }}
            className={`px-4 py-2 rounded-xl font-light transition-all flex items-center gap-2 backdrop-blur-md border ${
              todayCompleted
                ? isDark
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-black/10 border-black/20 text-black'
                : isDark
                  ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50'
                  : 'bg-neutral-200/50 border-neutral-300/50 text-neutral-700 hover:bg-neutral-300/50'
            }`}
          >
            <FiCheck size={18} className={todayCompleted ? 'opacity-100' : 'opacity-50'} />
            {todayCompleted ? 'Fait' : 'À faire'}
          </motion.button>
        </div>
      </div>

      {/* Bordure subtile au survol */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
        isDark
          ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]'
          : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]'
      }`} />
    </motion.div>
  )
}

export default HabitCard
