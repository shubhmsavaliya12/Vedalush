import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { HelmetProvider } from 'react-helmet-async';
import useVisitorTracking from './hooks/useVisitorTracking';
import CookieConsent from './components/ui/CookieConsent';
import Chatbot from './components/ui/Chatbot';

// Lazy loaded pages for performance
const Home = lazy(() => import('./pages/Home'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Profile = lazy(() => import('./pages/Profile'));
const SkinTypeGuide = lazy(() => import('./pages/SkinTypeGuide'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

// A simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-nature-50">
    <div className="w-12 h-12 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  useVisitorTracking();
  
  return (
    <HelmetProvider>
    <AuthProvider>
    <CurrencyProvider>
      <Router>
        <CookieConsent />
        <Chatbot />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skin-type" element={<SkinTypeGuide />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </CurrencyProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
