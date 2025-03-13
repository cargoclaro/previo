import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Index from './pages/Index';
import Auth from './pages/Auth';
import PedimentoSelection from './pages/PedimentoSelection';
import GoodsCondition from './pages/GoodsCondition';
import ProductVerification from './pages/ProductVerification';
import RegisterPrevio from './pages/RegisterPrevio';
import EmbalajePrevio from './pages/EmbalajePrevio';
import PrevioPreview from './pages/PrevioPreview';
import PrevioComplete from './pages/PrevioComplete';
import PreviosHistory from './pages/PreviosHistory';
import PrevioDetails from './pages/PrevioDetails';
import ProductsGallery from './pages/ProductsGallery';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
          
          {/* Protected routes */}
          <Route path="/pedimento-selection" element={
            <ProtectedRoute>
              <PedimentoSelection />
            </ProtectedRoute>
          } />
          <Route path="/goods-condition" element={
            <ProtectedRoute>
              <GoodsCondition />
            </ProtectedRoute>
          } />
          <Route path="/product-verification" element={
            <ProtectedRoute>
              <ProductVerification />
            </ProtectedRoute>
          } />
          <Route path="/register-previo" element={
            <ProtectedRoute>
              <RegisterPrevio />
            </ProtectedRoute>
          } />
          <Route path="/embalaje-previo" element={
            <ProtectedRoute>
              <EmbalajePrevio />
            </ProtectedRoute>
          } />
          <Route path="/previo-preview" element={
            <ProtectedRoute>
              <PrevioPreview />
            </ProtectedRoute>
          } />
          <Route path="/previo-complete" element={
            <ProtectedRoute>
              <PrevioComplete />
            </ProtectedRoute>
          } />
          <Route path="/previos-history" element={
            <ProtectedRoute>
              <PreviosHistory />
            </ProtectedRoute>
          } />
          <Route path="/previo-details/:previoId" element={
            <ProtectedRoute>
              <PrevioDetails />
            </ProtectedRoute>
          } />
          <Route path="/products-gallery" element={
            <ProtectedRoute>
              <ProductsGallery />
            </ProtectedRoute>
          } />
          <Route path="/product-details/:productId" element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}

export default App;
