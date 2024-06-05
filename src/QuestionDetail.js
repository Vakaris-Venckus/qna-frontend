// src/QuestionDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import {jwtDecode} from 'jwt-decode';
import Navbar from './Navbar';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [answerContent, setAnswerContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    }
    fetchQuestion();
    fetchCategories();
  }, [id]);

  const fetchQuestion = () => {
    axiosInstance.get(`/api/questions/${id}`)
      .then(response => {
        setQuestion(response.data.question);
        setAnswers(response.data.answers);
      })
      .catch(error => {
        console.error('There was an error fetching the question!', error);
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

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.post(
        `/api/questions/${id}/answers`,
        { content: answerContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswerContent('');
      fetchQuestion(); // Refresh answers
    } catch (error) {
      console.error('Error submitting answer', error);
    }
  };

  const handleVote = async (answerId, vote) => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.post(
        `/api/answers/${answerId}/vote`,
        { vote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestion(); // Refresh answers
    } catch (error) {
      console.error('Error voting', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditTitle(question.title);
    setEditCategory(question.category_id);
    setEditDescription(question.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.put(
        `/api/questions/${id}`,
        { title: editTitle, category_id: editCategory, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      fetchQuestion(); // Refresh question
    } catch (error) {
      console.error('Error updating question', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/'); // Redirect to questions list
    } catch (error) {
      console.error('Error deleting question', error);
    }
  };

  return (
    <div>
    <Navbar />
    <div className="container mt-5">
      <h2 className="mb-4">Question Details</h2>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
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
          <button type="submit" className="btn btn-success me-2">Update Question</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
        </form>
      ) : (
        <div>
          <h3>{question.title}</h3>
          <p>{question.description}</p>
          {question.created_at && (
            <p className="text-muted small">Created at: {new Date(question.created_at).toLocaleString()}</p>
          )}
          {question.edited_at && (
            <p className="text-muted small">Last edited at: {new Date(question.edited_at).toLocaleString()}</p>
          )}
          {currentUser && currentUser.id === question.user_id && (
            <div>
              <button className="btn btn-warning me-2" onClick={handleEditClick}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleAnswerSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Your Answer:</label>
          <textarea
            className="form-control"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Answer</button>
      </form>
      <ul className="list-group mt-4">
        {answers.map(answer => (
          <li key={answer.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-1">{answer.content}</p>
              <div>
                <button className="btn btn-outline-success me-2" onClick={() => handleVote(answer.id, 1)}>
                  <i className="bi bi-arrow-up"></i> {answer.upvotes}
                </button>
                <button className="btn btn-outline-danger" onClick={() => handleVote(answer.id, -1)}>
                  <i className="bi bi-arrow-down"></i> {answer.downvotes}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default QuestionDetail;
