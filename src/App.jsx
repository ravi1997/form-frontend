// src/App.jsx
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import FormPreviewPage from './pages/FormPreview';

function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  if (!loggedIn) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // TODO: Replace with real auth check (cookies/localStorage/api)
    const token = document.cookie.includes("access_token_cookie");
    setLoggedIn(token);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginPage onLoginSuccess={() => setLoggedIn(true)} />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form/:formId"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <FormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/preview"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <FormPreviewPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
