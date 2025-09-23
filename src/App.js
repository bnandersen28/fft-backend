import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './home';
import RecipeCategoryPage from './RecipeCategoryPage'; // adjust the path


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:category" element={<RecipeCategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
