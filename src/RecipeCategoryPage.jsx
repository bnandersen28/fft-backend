import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    collection,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { addRecipe } from './addrecipe';
import { updateRecipe } from './addrecipe';
import { use } from 'react';


const RecipeCategoryPage = () => {
    const { category } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);


    // Form fields
    const [name, setName] = useState('');
    const [ingredientIds, setIngredientIds] = useState('');
    const [allergens, setAllergens] = useState('');
    const [subingredients, setSubingredients] = useState('');
    const [crosscontamination, setCrosscontamination] = useState('');

    //Inline edit form
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const q = query(
            collection(db, 'recipes'),
            where('category', '==', category)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setRecipes(results);
        });

        return () => unsubscribe();
    }, [category]);

    //Handle Input for inline editing of current recipes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                //update existing recipe
                await updateRecipe(editingId, {
                    name,
                    category,
                    ingredientIds: ingredientIds.split(',').map(i => i.trim()),
                    allergens: allergens ? allergens.split(',').map(a => a.trim()) : [],
                    subingredients: subingredients ? subingredients.split(',').map(s => s.trim()) : [],
                    crosscontamination: crosscontamination ? crosscontamination.split(',').map(c => c.trim()) : [],
                });
            } else {
                await addRecipe({
                    name,
                    category,
                    ingredientIds: ingredientIds.split(',').map(i => i.trim()),
                    allergens: allergens
                        ? allergens.split(',').map(a => a.trim())
                        : [],
                    subingredients: subingredients ? subingredients.split(',').map(s => s.trim()) : [],
                    crosscontamination: crosscontamination ? crosscontamination.split(',').map(c => c.trim()) : [],
                });
            }
            // Reset form
            setName('');
            setIngredientIds('');
            setAllergens('');
            setEditingId(null);
            setSubingredients('');
            setCrosscontamination('');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    //Save edited recipe
    const handleSave = async (id) => {
        try {
            await updateRecipe(id, {
                name: formData.name,
                category,
                ingredientIds: formData.ingredientIds ? formData.ingredientIds.split(',').map(i => i.trim()) : [],
                allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [],
                subingredients: formData.subingredients ? formData.subingredients.split(',').map(s => s.trim()) : [],
                crosscontamination: formData.crosscontamination ? formData.crosscontamination.split(',').map(c => c.trim()) : [],
            });
            setEditingId(null);
            setExpandedId(null);
            setFormData({});
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    const startEdit = (recipe) => {
        setEditingId(recipe.id);
        setFormData({
            name: recipe.name,
            ingredientIds: recipe.ingredientIds ? recipe.ingredientIds.join(', ') : '',
            allergens: recipe.allergens ? recipe.allergens.join(', ') : '',
            subingredients: recipe.subingredients ? recipe.subingredients.join(', ') : '',
            crosscontamination: recipe.crosscontamination ? recipe.crosscontamination.join(', ') : '',
        })
    }

    return (
        <>
            <div class="recipes-top">   
            <div className="back-button" onClick={() => window.history.back()}>Back</div>
                <h2> {category}</h2>

                <button onClick={() => setShowForm(!showForm)}>
                    {'Add Recipe'}
                </button>
            

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div>
                            <label>Name:</label><br />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ width: '500px' }} />
                        </div>
                        <div>
                            <label>Ingredient IDs (comma-separated):</label><br />
                            <input
                                value={ingredientIds}
                                onChange={(e) => setIngredientIds(e.target.value)}
                                style={{ width: '500px' }}
                                placeholder="e.g. garlic,tomato,sauce" />
                        </div>
                        <div>
                            <label>Allergens (comma-separated, optional):</label><br />
                            <input
                                value={allergens}
                                onChange={(e) => setAllergens(e.target.value)}
                                style={{ width: '500px' }}
                                placeholder="e.g. milk,gluten" />
                        </div>
                        <div>
                            <label>Sub-Ingredients (comma-separated, optional):</label><br />
                            <input
                                value={subingredients}
                                onChange={(e) => setSubingredients(e.target.value)}
                                style={{ width: '500px' }}
                            />
                        </div>
                        <div>
                            <label>Cross-Contamination (comma-separated, optional):</label><br />
                            <input
                                value={crosscontamination}
                                onChange={(e) => setCrosscontamination(e.target.value)}
                                style={{ width: '500px' }}
                            />
                        </div>
                        <button type="submit" style={{ marginTop: '10px' }}>
                            {'Save Recipe'}
                        </button>
                    </form>
                )}
                </div>
                <div className="recipes">
                <h3 style={{ marginTop: '40px' }}>{category.charAt(0).toUpperCase() + category.slice(1)} Recipes</h3>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <div
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() =>
                                    setExpandedId(expandedId === recipe.id ? null : recipe.id)}
                            >
                                {recipe.name}</div>
                            {expandedId === recipe.id && (
                                <div style={{ marginLeft: '15px', marginTop: '10px' }} >
                                    {editingId == recipe.id ? (
                                        <>
                                            <div>
                                                <label>Name:</label>
                                                <input
                                                    value={formData.name || ''}
                                                    style={{ width: '500px' }}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label>Ingredients (comma seperated):</label>
                                                <input
                                                    value={formData.ingredientIds || ''}
                                                    style={{ width: '500px' }}
                                                    onChange={(e) => handleInputChange('ingredientIds', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label>Allergens (comma separated):</label>
                                                <input
                                                    value={formData.allergens || ''}
                                                    style={{ width: '500px' }}
                                                    onChange={(e) => handleInputChange('allergens', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label>Sub-Ingredients (comma separated):</label>
                                                <input
                                                    value={formData.subingredients || ''}
                                                    style={{ width: '500px' }}
                                                    onChange={(e) => handleInputChange('subingredients', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label>Cross-Contamination (comma separated):</label>
                                                <input
                                                    value={formData.crosscontamination || ''}
                                                    style={{ width: '500px' }}
                                                    onChange={(e) => handleInputChange('crosscontamination', e.target.value)}
                                                />
                                            </div>
                                            <button onClick={() => handleSave(recipe.id)}>Save</button>
                                            <button onClick={() => setEditingId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>

                                            <p>Ingredients: {recipe.ingredientIds?.join(', ') || 'None'}</p>
                                            <p>Allergens: {recipe.allergens?.join(', ') || 'None'}</p>
                                            <p>Sub-Ingredients: {recipe.subingredients?.join(', ') || 'None'}</p>
                                            <p>Cross-Contamination: {recipe.crosscontamination?.join(', ') || 'None'}</p>
                                            <button
                                                style={{ marginLeft: '10px' }}
                                                onClick={() => startEdit(recipe)}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                                </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default RecipeCategoryPage;
