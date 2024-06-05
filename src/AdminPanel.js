// src/AdminPanel.js
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'; // Import the Axios instance
import Navbar from './Navbar';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  const fetchQuestions = () => {
    axiosInstance.get('/api/questions')
      .then(response => {
        setQuestions(response.data);
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

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setTitle(question.title);
    setCategory(question.category_id);
    setDescription(question.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.put(
        `/api/questions/${editingQuestion.id}`,
        { title, category_id: category, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question', error);
    }
  };

  return (
    <div>
    <Navbar />
    <div className="container mt-5">
      <h1 className="mb-4">Admin Panel</h1>
      <ul className="list-group mb-4">
        {questions.map(question => (
          <li key={question.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{question.title}</h5>
            </div>
            <div>
              <button className="btn btn-warning me-2" onClick={() => handleEdit(question)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(question.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {editingQuestion && (
        <form onSubmit={handleUpdate} className="mb-5">
          <h2>Edit Question</h2>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category:</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success me-2">Update Question</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditingQuestion(null)}>Cancel</button>
        </form>
      )}
    </div>
    </div>
  );
};

export default AdminPanel;
