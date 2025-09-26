import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { updateRecipe } from './addrecipe';
import { use } from 'react';

//displays information for already existing recipes and allows editing
const RecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const categoryFromNav = location.state?.category || "";


    const [recipe, setRecipe] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [category, setCategory] = useState(categoryFromNav);

    //Fetch recipe data from Firestore
    useEffect(() => {
        async function fetchRecipe() {
            const docRef = doc(db, 'recipes', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setRecipe(docSnap.data());
                setFormData(docSnap.data());
            } else {
                console.log('No such document!');
            }
        }
        fetchRecipe();
    }, [id]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    //Save edited recipe
    const handleSave = async () => {
        try {
            await updateRecipe(id, {
                name: formData.name,
                category,
                ingredientIds: Array.isArray(formData.ingredientIds)
                    ? formData.ingredientIds   // already an array
                    : formData.ingredientIds.split(',').map(i => i.trim()),

                allergens: Array.isArray(formData.allergens)
                    ? formData.allergens
                    : (formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : []),

                subingredients: Array.isArray(formData.subingredients)
                    ? formData.subingredients
                    : (formData.subingredients ? formData.subingredients.split(',').map(s => s.trim()) : []),

                crosscontamination: Array.isArray(formData.crosscontamination)
                    ? formData.crosscontamination
                    : (formData.crosscontamination ? formData.crosscontamination.split(',').map(c => c.trim()) : []),
            });
        
        setEditing(false);
        navigate(-1); // Go back to previous page
    } catch (error) {
        console.error('Error updating recipe:', error);
    }
};

if (!recipe) return <p>Loading recipe...</p>;

return (
    <div style={{ padding: "20px" }}>
        <button onClick={() => navigate(-1)}>Back</button>
        <h2>{recipe.name}</h2>

        {editing ? (
            <div>
                <label>Name:</label>
                <input
                    value={formData.name || recipe.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <br />
                <label>Ingredients:</label>
                <input
                    value={formData.ingredientIds || recipe.ingredientIds?.join(", ")}
                    onChange={(e) => handleInputChange("ingredientIds", e.target.value)}
                />
                <br />
                <label>Allergens:</label>
                <input
                    value={formData.allergens || recipe.allergens?.join(", ")}
                    onChange={(e) => handleInputChange("allergens", e.target.value)}
                />
                <br />
                <label>Sub-Ingredients:</label>
                <input
                    value={formData.subingredients || recipe.subingredients?.join(", ")}
                    onChange={(e) =>
                        handleInputChange("subingredients", e.target.value)
                    }
                />
                <br />
                <label>Cross-Contamination:</label>
                <input
                    value={
                        formData.crosscontamination ||
                        recipe.crosscontamination?.join(", ")
                    }
                    onChange={(e) =>
                        handleInputChange("crosscontamination", e.target.value)
                    }
                />
                <br />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
        ) : (
            <div>
                <p><strong>Ingredients:</strong> {recipe.ingredientIds?.join(", ") || "None"}</p>
                <p><strong>Allergens:</strong> {recipe.allergens?.join(", ") || "None"}</p>
                <p><strong>Sub-Ingredients:</strong> {recipe.subingredients?.join(", ") || "None"}</p>
                <p><strong>Cross-Contamination:</strong> {recipe.crosscontamination?.join(", ") || "None"}</p>
                <button onClick={() => setEditing(true)}>Edit</button>
            </div>
        )}
    </div>
);
};

export default RecipePage;
