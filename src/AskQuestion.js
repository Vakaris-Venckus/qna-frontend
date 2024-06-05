import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance'; // Import the Axios instance
import Navbar from './Navbar';

const AskQuestion = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories from the backend
        axiosInstance.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        try {
            await axiosInstance.post(
                '/api/questions',
                { title, category_id: category, description },
                { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
            );
            navigate('/');
        } catch (error) {
            console.error('Error asking question', error);
        }
    };

    return (
        <div>
        <Navbar />
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-4">Ask a Question</h2>
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        maxLength={50}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category:</label>
                    <select 
                        className="form-select" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea 
                        className="form-control" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default AskQuestion;
