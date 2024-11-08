// frontend/src/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/rules';

export const fetchRules = () => axios.get(API_URL);
export const addRule = (rule) => axios.post(API_URL, rule);
export const updateRule = (id, rule) => axios.put(`${API_URL}/${id}`, rule);
export const deleteRule = (id) => axios.delete(`${API_URL}/${id}`);
