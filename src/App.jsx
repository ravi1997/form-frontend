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
import FormHomePage from './pages/FormHomePage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import FormPreviewPage from './pages/FormPreview';
import FormBuilderPage from './pages/builder/FormBuilderPage';
import FormResponseHomePage from './pages/FormResponseHomePage';
import FormResponsesPage from './pages/FormResponsesPage.jsx';
import ViewResponsePage from './pages/ViewResponsePage.jsx';

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
    <Routes>
      {/* Public Login Route */}
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

      {/* Protected Pages */}
      <Route
        path="/home"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ New route to show list of forms or allow selection */}
      <Route
        path="/forms"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <FormHomePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Existing route for specific form */}
      <Route
        path="/form/:formId"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <FormPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ New route to show list of forms or allow selection */}
      <Route
        path="/formsResponse"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <FormResponseHomePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Existing route for specific form */}
      <Route
        path="/formResponse/:formId"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <FormResponsesPage />
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
      <Route path="/settings" element={
        <ProtectedRoute loggedIn={loggedIn}>
          <SettingsPage />
        </ProtectedRoute>
      } />

      <Route path="/terms" element={
        <ProtectedRoute loggedIn={loggedIn}>
          <TermsPage />
        </ProtectedRoute>
      } />

      <Route
        path="/createform"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <FormBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/form/:formId/response/:responseId" element={<ViewResponsePage />} />

    </Routes>

  );
}

export default App;
