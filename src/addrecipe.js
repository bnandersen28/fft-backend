//src/api/addrecipe.js
import { collection, doc, setDoc,updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { nameToSlug } from './utils';

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
    const slug = nameToSlug(name);

    const recipeRef = doc(collection(db, 'recipes')); // use custom ID
    
     await setDoc(recipeRef, {
        name,
        category,
        ingredientIds,
        allergens,
        subingredients,
        crosscontamination,
        createdAt: serverTimestamp(), 
        slug,
    });
    return recipeRef.id; //stable doc Id
};

/**
 * Edit recipe info based on an id
 */
export const updateRecipe = async (id, data)=>{
    try{
        const recipeRef= doc(db, "recipes",id);
        
        //If updating name, also update slug
        let updatedData = {...data};
        if(data.name){
            updatedData.slug = nameToSlug(data.name);
        }

        await updateDoc(recipeRef, data);
        console.log("Recipe updated successfully");
    }catch(error){
        console.error("Error updating recipe:", error);
    }
};