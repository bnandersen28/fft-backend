// server.js or your main backend file
const admin = require('firebase-admin');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { checkAllergens } = require('./src/checkAllergens');
const path = require("path");

const serviceAccount = require('./fft-allergen-check-firebase-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fft-allergen-check.firebaseio.com' // Replace with your Firebase project ID
});

const app = express();
app.use(bodyParser.json());



app.use(cors());


// API route to add a recipe
app.post('/api/recipes', async (req, res) => {
  console.log("Recieved request");
  const { name, ingredients } = req.body;
  console.log('Name:', name);
  console.log('Ingredients:', ingredients);

  try {
    const recipeRef = await admin.firestore().collection('recipes').doc(name);
    await recipeRef.set({  
    ingredients,
    });
    console.log(`Recipe "${name}" added successfully.`);


    const newRecipe = { id: recipeRef.id ,name, ingredients };
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).send('Failed to add recipe');
  }
});


//API to check an allergen 
app.post("/api/check-allergens", async (req, res) => {
  try {
    const { mainId, sides, dressings, additionals, allergens } = req.body;
    const result = await checkAllergens(mainId, sides, dressings, additionals, allergens);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Serve React build in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  // serve index.html for any unknown route (React handles routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
