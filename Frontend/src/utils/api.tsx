const default_server_api = import.meta.env.VITE_DEFAULT_API


export const servers ={
    server1:default_server_api,
}


import axios from 'axios';


const api = axios.create({
  baseURL: servers.server1,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;