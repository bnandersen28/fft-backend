import React from 'react';

const Home = () => {
    const handleAddRecipe = () => {
        // Logic to add a recipe
        console.log('Add Recipe button clicked');
    };

    const handleEditRecipe = () => {
        // Logic to edit a recipe
        console.log('Edit Recipe button clicked');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Recipe Manager</h1>
            <button onClick={handleAddRecipe} style={{ margin: '10px', padding: '10px 20px' }}>
                Add Recipe
            </button>
            <button onClick={handleEditRecipe} style={{ margin: '10px', padding: '10px 20px' }}>
                Edit Recipe
            </button>
        </div>
    );
};

export default Home;