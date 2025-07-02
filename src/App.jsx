// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FormPage from './pages/FormPage';
import FormPreviewPage from './pages/FormPreview';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Optionally check cookie/localStorage or ping backend
    // Example: setLoggedIn(document.cookie.includes("access_token_cookie"));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <FormPage />
              ) : (
                <LoginPage onLoginSuccess={() => setLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/preview"
            element={
              loggedIn ? (
                <FormPreviewPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
