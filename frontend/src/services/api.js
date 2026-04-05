import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8083/api",
  headers: {
    "Content-Type": "application/json",
  },
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
};


export const userAPI = {
  getAll: () => API.get("/users"),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  toggleStatus: (id) => API.put(`/users/${id}/status`),
  delete: (id) => API.delete(`/users/${id}`),
};


export const financeAPI = {
  getAll: (page = 0, size = 20) => API.get(`/finance?page=${page}&size=${size}`),
  getAllRecords: () => API.get("/finance/all"),
  getById: (id) => API.get(`/finance/${id}`),
  create: (data) => API.post("/finance", data),
  update: (id, data) => API.put(`/finance/${id}`, data),
  delete: (id) => API.delete(`/finance/${id}`),
  filter: (params) => API.get("/finance/filter", { params }),
  search: (keyword) => API.get(`/finance/search?keyword=${keyword}`),
};


export const dashboardAPI = {
  getSummary: () => API.get("/dashboard/summary"),
  getCategorySummary: () => API.get("/dashboard/category-summary"),
  getMonthlyTrends: () => API.get("/dashboard/monthly-trends"),
  getRecent: () => API.get("/dashboard/recent"),
};

export default API;