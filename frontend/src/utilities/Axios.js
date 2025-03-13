import axios from "axios";

// Create an Axios instance
const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Base URL of your backend
});

// Add a request interceptor to include the access token
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Get token from localStorage

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;




