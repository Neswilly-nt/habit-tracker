import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiClock, FiType, FiAlignLeft, FiCheck } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

const colors = [
  '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666',
  '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#ffffff',
]

const icons = ['⭐', '💪', '📚', '🧘', '🏃', '🥗', '💧', '😴', '🎯', '✍️', '🎨', '🎵', '🎬', '📝', '🧠', '❤️', '🌟', '⚡', '🌱', '🎼']

const AddHabitModal = ({ isOpen, onClose, onHabitAdded, isDark }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [reminderTime, setReminderTime] = useState('09:00')
  const [color, setColor] = useState('#000000')
  const [icon, setIcon] = useState(icons[0])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [focusedField, setFocusedField] = useState(null)

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Le nom de l\'habitude est requis')
      return
    }

    setLoading(true)
    
    try {
      await axios.post('http://localhost:5000/api/habits', {
        name,
        description,
        reminderTime,
        color,
        icon,
      })
      
      toast.success('Habitude créée avec succès !')
      
      onHabitAdded()
      onClose()
      
      // Reset form
      setName('')
      setDescription('')
      setReminderTime('09:00')
      setColor('#000000')
      setIcon(icons[0])
      setStep(1)
    } catch (error) {
      toast.error('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (!name.trim()) {
      toast.error('Veuillez d\'abord donner un nom à votre habitude')
      return
    }
    setStep(2)
  }

  const prevStep = () => setStep(1)

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay avec blur */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />

          {/* Modal - Version corrigée pour mobile */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            {/* Effet de superposition glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 rounded-3xl transform scale-105 blur-xl" />
            
            <div className={`relative backdrop-blur-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] ${
              isDark
                ? 'bg-neutral-900/40 border-neutral-800/30'
                : 'bg-white/40 border-white/30'
            }`}>
              {/* Header - Fixe */}
              <div className={`px-4 md:px-8 py-4 md:py-6 border-b flex-shrink-0 ${
                isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-light tracking-tight">
                      {step === 1 ? 'Nouvelle' : 'Personnaliser'}
                      <span className="text-neutral-400 dark:text-neutral-600 mx-2">·</span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {step === 1 ? 'habitude' : 'le style'}
                      </span>
                    </h2>
                    <p className={`text-xs md:text-sm font-light mt-1 ${
                      isDark ? 'text-neutral-500' : 'text-neutral-500'
                    }`}>
                      {step === 1 
                        ? 'Commencez par les informations de base'
                        : 'Ajoutez une touche personnelle'
                      }
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? 'hover:bg-neutral-800/50 text-neutral-400'
                        : 'hover:bg-neutral-200/50 text-neutral-600'
                    }`}
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>

                {/* Stepper */}
                <div className="flex gap-2 mt-4 md:mt-6">
                  <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    step >= 1
                      ? isDark ? 'bg-white' : 'bg-black'
                      : isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                  }`} />
                  <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    step >= 2
                      ? isDark ? 'bg-white' : 'bg-black'
                      : isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                  }`} />
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-8 py-4 md:py-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-4 md:space-y-6"
                    >
                      {/* Nom */}
                      <div className="space-y-2">
                        <label className={`text-xs font-light uppercase tracking-wider transition-colors duration-300 ${
                          focusedField === 'name'
                            ? isDark ? 'text-white' : 'text-black'
                            : isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          Nom de l'habitude
                        </label>
                        <div className="relative group">
                          <div className="relative flex items-center">
                            <FiType className={`absolute left-4 transition-all duration-300 ${
                              focusedField === 'name'
                                ? isDark ? 'text-white' : 'text-black'
                                : isDark ? 'text-neutral-600' : 'text-neutral-400'
                            }`} size={18} />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-transparent border-b-2 transition-all duration-300 outline-none text-sm md:text-base ${
                                isDark
                                  ? 'text-white placeholder-neutral-600'
                                  : 'text-black placeholder-neutral-400'
                              }`}
                              style={{
                                borderColor: focusedField === 'name'
                                  ? isDark ? '#ffffff' : '#000000'
                                  : isDark ? '#333333' : '#e5e5e5',
                              }}
                              placeholder="ex: Méditation, Sport, Lecture..."
                              autoFocus
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className={`text-xs font-light uppercase tracking-wider transition-colors duration-300 ${
                          focusedField === 'description'
                            ? isDark ? 'text-white' : 'text-black'
                            : isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          Description (optionnelle)
                        </label>
                        <div className="relative group">
                          <div className="relative flex items-start">
                            <FiAlignLeft className={`absolute left-4 top-4 transition-all duration-300 ${
                              focusedField === 'description'
                                ? isDark ? 'text-white' : 'text-black'
                                : isDark ? 'text-neutral-600' : 'text-neutral-400'
                            }`} size={18} />
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              onFocus={() => setFocusedField('description')}
                              onBlur={() => setFocusedField(null)}
                              rows="3"
                              className={`w-full pl-12 pr-4 py-3 bg-transparent border-b-2 transition-all duration-300 outline-none resize-none text-sm md:text-base ${
                                isDark
                                  ? 'text-white placeholder-neutral-600'
                                  : 'text-black placeholder-neutral-400'
                              }`}
                              style={{
                                borderColor: focusedField === 'description'
                                  ? isDark ? '#ffffff' : '#000000'
                                  : isDark ? '#333333' : '#e5e5e5',
                              }}
                              placeholder="Une petite description pour vous motiver..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Heure de rappel */}
                      <div className="space-y-2">
                        <label className={`text-xs font-light uppercase tracking-wider transition-colors duration-300 ${
                          focusedField === 'time'
                            ? isDark ? 'text-white' : 'text-black'
                            : isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          Heure du rappel
                        </label>
                        <div className="relative group">
                          <div className="relative flex items-center">
                            <FiClock className={`absolute left-4 transition-all duration-300 ${
                              focusedField === 'time'
                                ? isDark ? 'text-white' : 'text-black'
                                : isDark ? 'text-neutral-600' : 'text-neutral-400'
                            }`} size={18} />
                            <input
                              type="time"
                              value={reminderTime}
                              onChange={(e) => setReminderTime(e.target.value)}
                              onFocus={() => setFocusedField('time')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-transparent border-b-2 transition-all duration-300 outline-none text-sm md:text-base ${
                                isDark
                                  ? 'text-white'
                                  : 'text-black'
                              }`}
                              style={{
                                borderColor: focusedField === 'time'
                                  ? isDark ? '#ffffff' : '#000000'
                                  : isDark ? '#333333' : '#e5e5e5',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-6 md:space-y-8"
                    >
                      {/* Icône */}
                      <div className="space-y-4">
                        <label className={`text-xs font-light uppercase tracking-wider ${
                          isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          Choisissez une icône
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                          {icons.map((i) => (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setIcon(i)}
                              className={`relative p-2 md:p-3 text-xl md:text-2xl rounded-xl transition-all duration-300 ${
                                icon === i
                                  ? isDark
                                    ? 'bg-white/10 ring-1 ring-white/30'
                                    : 'bg-black/10 ring-1 ring-black/30'
                                  : isDark
                                    ? 'bg-neutral-800/50 hover:bg-neutral-800'
                                    : 'bg-neutral-200/50 hover:bg-neutral-200'
                              }`}
                            >
                              {i}
                              {icon === i && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                                    isDark ? 'bg-white' : 'bg-black'
                                  }`}
                                >
                                  <FiCheck size={10} className={isDark ? 'text-black' : 'text-white'} />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Couleur */}
                      <div className="space-y-4">
                        <label className={`text-xs font-light uppercase tracking-wider ${
                          isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          Choisissez une couleur
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                          {colors.map((c) => (
                            <motion.button
                              key={c}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setColor(c)}
                              className={`relative h-10 md:h-12 rounded-xl transition-all duration-300 ${
                                color === c
                                  ? 'ring-2 ring-offset-2 ring-black dark:ring-white'
                                  : ''
                              }`}
                              style={{ 
                                backgroundColor: c,
                                boxShadow: c === '#ffffff' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                              }}
                            >
                              {color === c && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <FiCheck 
                                    size={16} 
                                    className={
                                      c === '#000000' || c === '#1a1a1a' || c === '#333333'
                                        ? 'text-white'
                                        : 'text-black'
                                    } 
                                  />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Aperçu */}
                      <div className={`p-4 md:p-6 rounded-xl border ${
                        isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'
                      }`}>
                        <p className={`text-xs font-light uppercase tracking-wider mb-3 md:mb-4 ${
                          isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          Aperçu
                        </p>
                        <div className="flex items-center gap-3 md:gap-4">
                          <div 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl"
                            style={{ backgroundColor: color + '20' }}
                          >
                            {icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm md:text-base" style={{ color }}>
                              {name || 'Nouvelle habitude'}
                            </h3>
                            <p className={`text-xs md:text-sm font-light ${
                              isDark ? 'text-neutral-400' : 'text-neutral-600'
                            }`}>
                              {reminderTime} · Rappel quotidien
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Fixe en bas */}
              <div className={`px-4 md:px-8 py-4 md:py-6 border-t flex-shrink-0 flex justify-between ${
                isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'
              }`}>
                {step === 1 ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onClose}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-light text-sm md:text-base transition-all duration-300 backdrop-blur-md border ${
                        isDark
                          ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50'
                          : 'bg-neutral-200/50 border-neutral-300/50 text-neutral-700 hover:bg-neutral-300/50'
                      }`}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={nextStep}
                      className="px-6 md:px-8 py-2 md:py-3 rounded-xl font-light text-sm md:text-base transition-all duration-300 bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                    >
                      Suivant
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={prevStep}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-light text-sm md:text-base transition-all duration-300 backdrop-blur-md border ${
                        isDark
                          ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50'
                          : 'bg-neutral-200/50 border-neutral-300/50 text-neutral-700 hover:bg-neutral-300/50'
                      }`}
                    >
                      Retour
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="relative px-6 md:px-8 py-2 md:py-3 rounded-xl font-light text-sm md:text-base transition-all duration-300 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 overflow-hidden group"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Créer</span>
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddHabitModal
