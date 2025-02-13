// frontend/AddRecipe.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; //import firebase configuration
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';  

const AddRecipe = () => {
    let { category } = useParams();
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    
    const handleAddIngredient = () => {
        if (currentIngredient.trim() !== '') {
            setIngredients([...ingredients, currentIngredient.trim()]);
            setCurrentIngredient('');
        }
    };

    const handleAddRecipe = async () => {
        const recipe = {
            name: recipeName,
            ingredients,
        };
        console.log(recipe);

        try {
            const response = await fetch('http://localhost:5002/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipe),
            });
            console.log('Response:', response);

            if (response.ok) {
                alert('Recipe added successfully!');
                setRecipeName('');
                setIngredients([]);
                setCurrentIngredient('');
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
            <h1>Add a Recipe for {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            <div>
                <input
                    type="text"
                    value={recipeName}
                    placeholder="Recipe Name"
                    onChange={(e) => setRecipeName(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    value={currentIngredient}
                    placeholder="Add Ingredient"
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                />
                <button
                    onClick={handleAddIngredient}
                    style={{ margin: '10px', padding: '10px 20px' }}
                >
                    Add Ingredient
                </button>
            </div>
            <div>
                <h3>Ingredients:</h3>
                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            <button
                onClick={handleAddRecipe}
                style={{ margin: '20px', padding: '10px 20px' }}
            >
                Save Recipe
            </button>
        </div>
    );
};

export default AddRecipe;
