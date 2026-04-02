const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Habit = require('../models/Habit');

// @route   GET /api/habits
// @desc    Récupérer toutes les habitudes de l'utilisateur
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Ajouter les statistiques à chaque habitude
    const habitsWithStats = habits.map(habit => ({
      ...habit.toObject(),
      stats: habit.getStats(),
    }));
    
    res.json(habitsWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/habits
// @desc    Créer une nouvelle habitude
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, reminderTime, color, icon } = req.body;
    
    const habit = await Habit.create({
      user: req.user._id,
      name,
      description,
      reminderTime,
      color: color || '#007AFF',
      icon: icon || '⭐',
      completions: [],
    });
    
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/habits/:id/toggle
// @desc    Marquer une habitude comme complétée/non complétée pour aujourd'hui
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habitude non trouvée' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCompletion = habit.completions.find(c => 
      new Date(c.date).setHours(0,0,0,0) === today.getTime()
    );
    
    if (existingCompletion) {
      // Si la complétion existe, on la supprime (toggle off)
      habit.completions = habit.completions.filter(c => 
        new Date(c.date).setHours(0,0,0,0) !== today.getTime()
      );
    } else {
      // Sinon on l'ajoute
      habit.completions.push({
        date: new Date(),
        completed: true,
      });
    }
    
    await habit.save();
    
    res.json({
      ...habit.toObject(),
      stats: habit.getStats(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Supprimer une habitude
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habitude non trouvée' });
    }
    
    res.json({ message: 'Habitude supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/habits/:id/heatmap
// @desc    Récupérer les données pour la heatmap
router.get('/:id/heatmap', protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habitude non trouvée' });
    }
    
    // Préparer les données pour la heatmap (365 derniers jours)
    const heatmapData = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const completion = habit.completions.find(c => 
        new Date(c.date).toISOString().split('T')[0] === dateStr
      );
      
      heatmapData.push({
        date: dateStr,
        count: completion && completion.completed ? 1 : 0,
      });
    }
    
    res.json(heatmapData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
