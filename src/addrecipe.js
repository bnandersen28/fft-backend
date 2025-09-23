//src/api/addrecipe.js
import { collection, doc, setDoc,updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Adds a recipe to Firestore 'recipes' collection
 * @param {Object} data - Recipe Data
 * @param {string} data.name - Name of the recipe
 * @param {string} data.category - Category of the recipe
 * @param {Array} data.ingredients - List of ingredients
 * @param {Array} data.allergens - Optional allergens
 * @param {Array<string>} data.subingredients - List of sub-ingredients
 * @param {Array<string>} data.crosscontamination - List of cross-contamination ingredients
 */
export const addRecipe = async ({ name, category, ingredientIds, allergens = [], subingredients = [], crosscontamination = [] }) => {

    const id = name.trim().toLowerCase().replace(/\s+/g, '-'); // e.g. "Cream Sauce" → "cream-sauce"

    const recipeRef = doc(collection(db, 'recipes'), id); // use custom ID
    
     await setDoc(recipeRef, {
        name,
        category,
        ingredientIds,
        allergens,
        subingredients,
        crosscontamination,
        createdAt: serverTimestamp()
    });
    return id;
};

/**
 * Edit recipe info based on an id
 */
export const updateRecipe = async (id, data)=>{
    try{
        const recipeRef= doc(db, "recipes",id);
        await updateDoc(recipeRef, data);
        console.log("Recipe updated successfully");
    }catch(error){
        console.error("Error updating recipe:", error);
    }
};