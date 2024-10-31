import React, { useState } from 'react';

const Home = () => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [allergens, setAllergens] = useState('');

    const handleAddRecipe = async () => {
        const recipe = {
            name: recipeName,
            ingredients: ingredients.split(',').map(item => item.trim()),
            allergens: allergens.split(',').map(item => item.trim()),
        };

        try {
            const response = await fetch('http://localhost:5000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipe),
            });

            if (response.ok) {
                alert('Recipe added successfully!');
                setRecipeName('');
                setIngredients('');
                setAllergens('');
            } else {
                throw new Error('Failed to add recipe');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding recipe');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Recipe Manager</h1>
            <input
                type="text"
                value={recipeName}
                placeholder="Recipe Name"
                onChange={(e) => setRecipeName(e.target.value)}
            />
            <input
                type="text"
                value={ingredients}
                placeholder="Ingredients (comma-separated)"
                onChange={(e) => setIngredients(e.target.value)}
            />
            <input
                type="text"
                value={allergens}
                placeholder="Allergens (comma-separated)"
                onChange={(e) => setAllergens(e.target.value)}
            />
            <button onClick={handleAddRecipe} style={{ margin: '10px', padding: '10px 20px' }}>
                Add Recipe
            </button>
        </div>
    );
};

export default Home;
