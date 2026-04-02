const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Le nom de l\'habitude est requis'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  reminderTime: {
    type: String,
    required: [true, 'L\'heure du rappel est requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)'],
  },
  color: {
    type: String,
    default: '#007AFF', // Bleu Apple par défaut
  },
  icon: {
    type: String,
    default: '⭐',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completions: [{
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: true,
    }
  }]
});

// Index pour améliorer les performances des requêtes
habitSchema.index({ user: 1, createdAt: -1 });

// Méthode pour obtenir les statistiques
habitSchema.methods.getStats = function() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  
  // Filtrer les complétions du jour
  const todayCompletion = this.completions.find(c => 
    new Date(c.date).setHours(0,0,0,0) === startOfDay.getTime()
  );
  
  // Calculer le streak actuel
  let currentStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  
  while (true) {
    const completion = this.completions.find(c => 
      new Date(c.date).setHours(0,0,0,0) === checkDate.getTime()
    );
    
    if (completion && completion.completed) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  // Calculer le pourcentage de réussite (30 derniers jours)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const last30DaysCompletions = this.completions.filter(c => 
    new Date(c.date) >= thirtyDaysAgo
  );
  
  const completedCount = last30DaysCompletions.filter(c => c.completed).length;
  const successRate = last30DaysCompletions.length > 0 
    ? (completedCount / last30DaysCompletions.length) * 100 
    : 0;
  
  return {
    todayCompleted: todayCompletion ? todayCompletion.completed : false,
    currentStreak,
    successRate: Math.round(successRate * 10) / 10,
    totalCompletions: this.completions.length,
  };
};

module.exports = mongoose.model('Habit', habitSchema);
