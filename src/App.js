import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './home';
import AddRecipe from './addrecipe';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addrecipe/:category" element={<AddRecipe />}  />
      </Routes>
    </Router>
  );
}

export default App;
