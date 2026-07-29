// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

import Layout from "./components/Layout";

import HomePage from "./components/pages/HomePage";
import EventsPage from "./components/pages/EventsPage";
import EventDetailsPage from "./components/pages/EventDetailsPage";
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import CheckoutSuccess from "./components/pages/CheckoutSuccess";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import UserDashboard from "./components/pages/UserDashboard";
import AdminDashboard from "./components/pages/AdminDashboard";

import AdminEvents from "./components/pages/AdminEvents";
import AdminEventForm from "./components/pages/AdminEventForm";
import AdminBookings from "./components/pages/AdminBookings";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Layout>
              <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/event/:id" element={<EventDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/manage-events" element={<EventsPage />} />

                {/* Auth required */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout-success"
                  element={
                    <ProtectedRoute>
                      <CheckoutSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events/new"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminEventForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events/:id/edit"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminEventForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminBookings />
                    </ProtectedRoute>
                  }
                />
                {/* placeholders */}
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute adminOnly>
                      <div className="container"><h2>Analytics (coming soon)</h2></div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <div className="container"><h2>User Management (coming soon)</h2></div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
