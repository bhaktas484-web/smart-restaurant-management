import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/v1`,
  withCredentials: true, // sends the httpOnly refresh cookie automatically
});

// Attach the access token from Zustand store to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, the access token has expired — the backend refresh-token flow
// would be wired here in a fuller build. For the hackathon MVP we just log
// the user out cleanly rather than looping on a failed refresh.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);