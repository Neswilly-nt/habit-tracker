const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'La variable d\'environnement MONGODB_URI est manquante. Ajoute-la dans ton fichier .env.'
    );
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    throw new Error(`Erreur de connexion MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
