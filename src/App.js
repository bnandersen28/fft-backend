import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './home';
import RecipeCategoryPage from './RecipeCategoryPage'; // adjust the path
import RecipePage from './RecipePage'; // adjust the path


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:slug" element={<RecipePage />} />
        <Route path="/category/:category" element={<RecipeCategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
