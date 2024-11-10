// frontend/src/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/rules';
const LOGS_API_URL = 'http://127.0.0.1:5000/api/logs'; // New endpoint for logs

export const fetchRules = () => axios.get(API_URL);
export const addRule = (rule) => axios.post(API_URL, rule);
export const updateRule = (id, rule) => axios.put(`${API_URL}/${id}`, rule);
export const deleteRule = (id) => axios.delete(`${API_URL}/${id}`);
export const fetchLogs = () => axios.get(LOGS_API_URL); // New function to fetch logs
