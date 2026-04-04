import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiChevronRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const success = await login(email, password)
    if (success) {
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Éléments de fond abstraits */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grand cercle flou */}
        <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-neutral-200/20 to-transparent dark:from-neutral-800/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-neutral-300/20 to-transparent dark:from-neutral-700/20 blur-3xl" />
        
        {/* Lignes diagonales */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Conteneur principal */}
      <div className="relative w-full max-w-md">
        {/* Logo ou marque */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-sm font-light tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600">
            Bienvenue
          </span>
          <h1 className="text-4xl font-light mt-2">
            <span className="font-bold">HABIT</span>
            <span className="text-neutral-300 dark:text-neutral-700 mx-2">·</span>
            <span className="text-neutral-500 dark:text-neutral-500">login</span>
          </h1>
        </motion.div>

        {/* Carte de connexion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Effet de superposition pour le glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 rounded-3xl transform scale-105 blur-xl" />
          
          <div className="relative backdrop-blur-2xl bg-white/40 dark:bg-neutral-900/40 rounded-3xl border border-white/30 dark:border-neutral-800/30 shadow-2xl p-8 md:p-10">
            
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-light tracking-tight">
                Accéder à votre espace
              </h2>
              <div className="glass-divider mt-4" />
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ Email */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className={`text-xs font-light uppercase tracking-wider transition-colors duration-300 ${
                  focusedField === 'email' 
                    ? 'text-neutral-900 dark:text-white' 
                    : 'text-neutral-500 dark:text-neutral-500'
                }`}>
                  Adresse email
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    focusedField === 'email'
                      ? 'bg-gradient-to-r from-neutral-900/5 to-neutral-600/5 dark:from-white/10 dark:to-white/5 blur-md'
                      : ''
                  }`} />
                  <div className="relative flex items-center">
                    <FiMail className={`absolute left-4 transition-all duration-300 ${
                      focusedField === 'email'
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`} size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-b-2 transition-all duration-300 outline-none text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600"
                      style={{
                        borderColor: focusedField === 'email'
                          ? '#000000'
                          : focusedField === null
                          ? '#e5e5e5'
                          : '#d4d4d4',
                        ...(focusedField === 'email' && {
                          borderBottomColor: '#000000',
                        }),
                      }}
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Champ Mot de passe */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className={`text-xs font-light uppercase tracking-wider transition-colors duration-300 ${
                  focusedField === 'password' 
                    ? 'text-neutral-900 dark:text-white' 
                    : 'text-neutral-500 dark:text-neutral-500'
                }`}>
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    focusedField === 'password'
                      ? 'bg-gradient-to-r from-neutral-900/5 to-neutral-600/5 dark:from-white/10 dark:to-white/5 blur-md'
                      : ''
                  }`} />
                  <div className="relative flex items-center">
                    <FiLock className={`absolute left-4 transition-all duration-300 ${
                      focusedField === 'password'
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`} size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-b-2 transition-all duration-300 outline-none text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600"
                      style={{
                        borderColor: focusedField === 'password'
                          ? '#000000'
                          : focusedField === null
                          ? '#e5e5e5'
                          : '#d4d4d4',
                        ...(focusedField === 'password' && {
                          borderBottomColor: '#000000',
                        }),
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Lien mot de passe oublié */}
              <motion.div variants={itemVariants} className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Mot de passe oublié ?
                </button>
              </motion.div>

              {/* Bouton de connexion */}
              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full group overflow-hidden rounded-xl"
                >
                  {/* Fond animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="relative py-4 px-6 flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-white dark:text-neutral-900 font-light tracking-wide">
                          Se connecter
                        </span>
                        <FiArrowRight className="text-white dark:text-neutral-900 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>

              {/* Séparateur élégant */}
              <motion.div variants={itemVariants} className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="glass-divider" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs font-light uppercase tracking-wider text-neutral-400 dark:text-neutral-600 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-sm rounded-full">
                    ou
                  </span>
                </div>
              </motion.div>

              {/* Lien vers l'inscription */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light">
                  Pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 text-neutral-900 dark:text-white hover:gap-2 transition-all duration-300 font-normal group"
                  >
                    Créer un compte
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>
                </p>
              </motion.div>
            </form>

            {/* Badge de sécurité */}
            <motion.div 
              variants={itemVariants}
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <div className="backdrop-blur-md bg-white/60 dark:bg-neutral-900/60 border border-white/20 dark:border-neutral-800/20 rounded-full px-4 py-1">
                <span className="text-xs text-neutral-500 dark:text-neutral-500 font-light">
              
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-xs text-neutral-400 dark:text-neutral-600 font-light"
        >
          © 2024 HABIT · Tous droits réservés
        </motion.div>
      </div>
    </div>
  )
}

export default Login
