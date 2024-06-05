import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain at least 3 numbers.');
            return;
        }

        if (username.length < 6) {
            setError('Username must be at least 8 characters long.');
            return;
        }

        try {
            console.log('Submitting registration form:', { username, email, password });
            const response = await axiosInstance.post('/api/register', { username, email, password });
            console.log('Registration successful', response);
            toast.success('Successfully registered! Now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Error registering', error);
            if (error.response) {
                setError(error.response.data.message || 'Registration failed. Please try again.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*\d.*\d.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5 w-25">
                <form onSubmit={handleSubmit}>
                    <h2 className="mb-4">Register</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            minLength={6}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Register;
