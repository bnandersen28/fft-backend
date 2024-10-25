import React, { useState } from 'react';
import { auth } from './firebase'; // Import the auth instance
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import sign-in method
import { home } from './home'; // Import the home component
import './css/style.css'; // Import your CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password); // Sign in the user
      alert('Login successful!'); // Handle successful login
      // Redirect to the home page
      window.location.href = '/home'; // Ensure this path is correct for your routing setup
    } catch (error) {
      setLoginError('Login failed: ' + error.message);
      console.log('Email:', email); // Log email
    console.log('Password:', password); // Log password // Capture and display error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Manager Portal Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />

          {loginError && <p className="error-message">{loginError}</p>} {/* Display error message */}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
