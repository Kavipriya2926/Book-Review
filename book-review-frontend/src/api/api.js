import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if deployed
  withCredentials: true,
});

export default api;
