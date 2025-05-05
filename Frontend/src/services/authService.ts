import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // or whatever your backend URL is

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (email: string, password: string, username: string) => {
  const res = await axios.post(`${API_URL}/auth/register`, { email, password, username });
  return res.data;
};
