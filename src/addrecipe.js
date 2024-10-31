// frontend/AddRecipe.js
import React, { useState } from 'react';

const AddRecipe = () => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [allergens, setAllergens] = useState('');

    const handleAddRecipe = async () => {
        const response = await fetch('http://localhost:5009/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                ingredients: ingredients.split(','),
                allergens: allergens.split(',')
            }),
        });

        if (response.ok) {
            const newRecipe = await response.json();
            console.log('Recipe added:', newRecipe);
        } else {
            console.error('Failed to add recipe');
        }
    };

    return (
        <div>
            <h2>Add Recipe</h2>
            <input
                type="text"
                placeholder="Recipe Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Ingredients (comma separated)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            <input
                type="text"
                placeholder="Allergens (comma separated)"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
            />
            <button onClick={handleAddRecipe}>Add Recipe</button>
        </div>
    );
};

export default AddRecipe;
