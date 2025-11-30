import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:2080';

export const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((c) => {
  const token = localStorage.getItem('token');
  if (token) c.headers.Authorization = `Bearer ${token}`;
  return c;
});
