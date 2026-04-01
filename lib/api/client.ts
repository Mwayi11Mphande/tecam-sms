import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Create Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------
// Custom API Error
// -----------------------------
export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// -----------------------------
// Request Interceptor (Attach Token)
// -----------------------------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Response Interceptor
// -----------------------------
api.interceptors.response.use(
  (response) => {
    if (response.data?.data !== undefined) {
      return response.data.data;
    }

    return response.data;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message =
      data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new ApiError(message, status, data));
  }
);