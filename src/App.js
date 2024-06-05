// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from './Login';
import Register from './Register';
import Questions from './Questions';
import QuestionDetail from './QuestionDetail';
import AskQuestion from './AskQuestion';
import AdminPanel from './AdminPanel';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute'; // Import the PublicRoute component

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded);
            } catch (error) {
                console.error('Failed to decode token', error);
            }
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/" element={<Questions />} />
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/questions/:id" element={<QuestionDetail />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute user={currentUser} role="admin">
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
