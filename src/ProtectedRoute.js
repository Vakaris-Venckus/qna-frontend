// src/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, role }) => {
    if (!user || user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
