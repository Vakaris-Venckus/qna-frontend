import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

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
        fetchQuestions();
        fetchCategories();

        // Check if redirected from login with success state
        if (location.state && location.state.success) {
            toast.success('Successfully logged in!');
            navigate(location.pathname, { replace: true, state: {} }); // Clear the state
        }
    }, [location, navigate]);

    const fetchQuestions = () => {
        axiosInstance.get('/api/questions')
            .then(response => {
                setQuestions(response.data.reverse()); // Reverse the order of questions
            })
            .catch(error => {
                console.error('There was an error fetching the questions!', error);
            });
    };

    const fetchCategories = () => {
        axiosInstance.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`/api/questions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQuestions(); // Refresh questions
        } catch (error) {
            console.error('Error deleting question', error);
        }
    };

    const handleEditClick = (question) => {
        setEditingQuestionId(question.id);
        setEditTitle(question.title);
        setEditCategory(question.category_id);
        setEditDescription(question.description);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.put(
                `/api/questions/${editingQuestionId}`,
                { title: editTitle, category_id: editCategory, description: editDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingQuestionId(null);
            fetchQuestions(); // Refresh questions
        } catch (error) {
            console.error('Error updating question', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingQuestionId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        navigate('/login');
        window.location.reload();
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Questions</h1>
                    {currentUser ? (
                        <div className="d-flex align-items-center">
                            <span className="me-3">{currentUser.username} ({currentUser.role})</span>
                            {currentUser.role === 'admin' && (
                                <Link to="/admin" className="btn btn-warning me-2">Admin Panel</Link>
                            )}
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>
                {currentUser && (
                    <div className="mb-4">
                        <Link to="/ask" className="btn btn-primary">Ask a Question</Link>
                    </div>
                )}
                <ul className="list-group">
                    {questions.map(question => (
                        <li key={question.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ minHeight: '70px' }}>
                            {editingQuestionId === question.id ? (
                                <form onSubmit={handleUpdate} className="w-100">
                                    <div className="mb-3">
                                        <label className="form-label">Title:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            maxLength={40}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category:</label>
                                        <select
                                            className="form-control"
                                            value={editCategory}
                                            onChange={(e) => setEditCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description:</label>
                                        <textarea
                                            className="form-control"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-success me-2">Update Question</button>
                                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className="flex-grow-1">
                                        <Link to={`/questions/${question.id}`} className="h5 text-decoration-none mb-0">{question.title}</Link>
                                        <p className="mb-0">Posted by {question.username} on {new Date(question.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="text-center me-3">
                                            <div className="badge bg-secondary">{question.answers_count}</div>
                                            <div>answers</div>
                                        </div>
                                        {currentUser && currentUser.id === question.user_id && (
                                            <div className="d-flex">
                                                <button className="btn btn-warning me-2" onClick={() => handleEditClick(question)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(question.id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Questions;
