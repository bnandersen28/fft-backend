import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/recipe/${category}`);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Recipe Manager</h1>
            <div>
            <button 
                onClick={() => handleCategoryClick('appetizers')}
                style={{ margin: '10px', padding: '10px 20px' }}>
                    Appetizers
            </button>
            <button
                onClick={()=> handleCategoryClick('soups') }
                style={{ margin: '10px', padding: '10px 20px' }}>
                    Soups
            </button>
            <button
                onClick={()=> handleCategoryClick('salads') }
                style={{ margin: '10px', padding: '10px 20px' }}>
                    Salads
            </button>
            <button
                onClick={()=> handleCategoryClick('sandwhiches') }
                style={{ margin: '10px', padding: '10px 20px' }}>
                    Sandwhiches
            </button>
            <button
                onClick={()=> handleCategoryClick('entrees') }
                style={{ margin: '10px', padding: '10px 20px' }}>
                    Entrees
            </button>
        </div>
    </div>
                    
        );
};

export default Home;
