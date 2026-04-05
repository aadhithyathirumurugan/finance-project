import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="main-content fade-in">
        <div className="empty-state" style={{ marginTop: "100px" }}>
          <div className="empty-state-icon" style={{ fontSize: "48px" }}>🔒</div>
          <h2 style={{ marginBottom: "8px" }}>Access Denied</h2>
          <p className="empty-state-text">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
