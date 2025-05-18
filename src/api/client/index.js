import axios from "axios";

const api = axios.create({
  timeout: 60000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const storedCredentials = localStorage.getItem('adminCredentials')
    if (storedCredentials) {
      const { username, password } = JSON.parse(storedCredentials)
      const credentials = btoa(`${username}:${password}`)
      config.headers['Authorization'] = `Basic ${credentials}`
    }
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error);
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("adminCredentials");
      document.dispatchEvent(new CustomEvent("authError"));
    }
    const errorMessage = error.response?.data?.message || error.message || 'An unpexpected error occurred'
    return Promise.reject(new Error(errorMessage));
  }
);

class AxiosClient {
  async post(url, data = {}, config = {}) {
    return api.post(url, data, config);
  }

  async get(url, params = {}) {
    return api.get(url, { params });
  }

  async delete(url, params = {}) {
    return api.delete(url, { params });
  }

  async patch(url, data = {}, config = {}) {
    return api.patch(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return api.put(url, data, config);
  }
}

export default new AxiosClient();