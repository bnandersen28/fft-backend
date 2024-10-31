// server.js or your main backend file
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://fft-allergen-check.firebaseio.com' // Replace with your Firebase project ID
});

const app = express();
app.use(bodyParser.json());

// API route to add a recipe
app.post('/api/recipes', async (req, res) => {
  const { name, ingredients, allergens } = req.body;

  try {
    const recipeRef = await admin.firestore().collection('recipes').add({
      name,
      ingredients,
      allergens
    });

    const newRecipe = { id: recipeRef.id, name, ingredients, allergens };
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).send('Failed to add recipe');
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
