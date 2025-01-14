// frontend/AddRecipe.js
import React, { useState } from 'react';
import { db } from '/firenbase'; //import firebase configuration
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';  

const AddRecipe = () => {
    const [name, setName] = useState('');
    const [ingredient, setIngredients] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    cosnt [isNameSubmitted, setIsNameSubmitted] = useState(false);

    const handleAddRecipeName = async () => {

        if(!name.trim()){
            alert('Please enter a recipe name');
            return;
        }
        try{
            await setDoc(doc(db, 'recipes', name), {
                name, 
                ingredients: [],//Initialize with an emptry array to later add to
            });
            setIsNameSubmitted(true);
            alert('Recipe name added successfully');
        }
                catch (error) {
                    console.error('Error adding recipe name:', error);
                    alert('Failed to add recipe name');
            }
    };

    //Add Ingredients to Firebase
    const handleAddIngredients = async () => {
        if(!ingredient.trim()){
            alert('Please enter an ingredient');
            return;
        }
        try{
            const recipeRef = doc(db, 'recipes', name);
            await updateDoc(recipeRef, {
                ingredients: arrayUnion(ingredient),
        });
        setIngredientsList((prev)=> [...prev, ingredient]);
        setIngredients('');
        alert('Ingredient added successfully');
    } catch (error) {
        console.error('Error adding ingredient:', error);
        alert('Failed to add ingredient');
    }
};

    return (
        <div>
            <h2>Add Recipe</h2>
            {!isNameSubmitted ? (
            <>
            <input
                type="text"
                placeholder="Recipe Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleAddRecipeName}>Add Recipe Name</button>
            </>
            ) : (
                <>
                <h3>Recipe: {name}</h3>
            <input
                type="text"
                placeholder="Ingredient Name"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            <button onClick={handleAddIngredients}>Add Ingredient</button>
            <h4> Ingredients Added:</h4>
            <u1>
                {ingredientsList.map((ing, index)=>{
                    <li key={index}>{ing}</li>
                })}
            </u1>
            </>
            )}
        </div>
    );
};

export default AddRecipe;
