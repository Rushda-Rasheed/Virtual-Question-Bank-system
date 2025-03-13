// frontend/src/utilities/api.js
import axios from 'axios';

// Base URL of your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Question Management APIs
export const fetchQuestions = (filters = {}) => {
  return api.get('/questions/get', { params: filters });
};

export const addQuestion = (questionData) => {
  return api.post('/questions/add', questionData);
};

export const updateQuestion = (id, updatedData) => {
  return api.put('/questions/edit', { id, ...updatedData });
};

export const deleteQuestion = (id) => {
  return api.delete('/questions/delete', { data: { id } });
};

export const uploadImages = (formData) => {
  return api.post('/questions/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Practice APIs
export const fetchPracticeQuestions = (filters = {}) => {
  return api.get('/practice', { params: filters });
};

export const submitAnswer = (answerData) => {
  return api.post('/practice/submit-answer', answerData);
};

// User Management APIs (if needed)
export const fetchUsers = () => {
  return api.get('/addusers/get');
};

export const addUser = (userData) => {
  return api.post('/addusers/post', userData);
};

export const updateUser = (id, updatedData) => {
  return api.put('/addusers/put', { id, ...updatedData });
};

export const deleteUser = (id) => {
  return api.delete('/addusers/delete', { data: { id } });
};

export default api;
