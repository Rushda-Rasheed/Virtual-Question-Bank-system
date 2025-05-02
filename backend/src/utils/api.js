
import axios from "axios";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const api = axios.create({
  baseURL: "/api/admin/questions", 
});

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response && error.response.status === 401) {
      
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
