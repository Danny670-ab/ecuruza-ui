
import axios from 'axios';

// Base URL — falls back to localhost if env missing (useful for local dev)
const API_BASE = (import.meta.env.VITE_REACT_BACKEND_URL as string) || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
	baseURL: API_BASE,
	headers: { 'Content-Type': 'application/json' },
});

/**
 * setAuthToken - helper to set or remove the Authorization header on the axios instance
 * and persist the token to localStorage.
 */
export function setAuthToken(token?: string | null, persist = true) {
	if (token) {
		axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		if (persist) {
			try { localStorage.setItem('token', token); } catch { /* ignore if not available */ }
		}
	} else {
		delete axiosInstance.defaults.headers.common['Authorization'];
		try { localStorage.removeItem('token'); } catch { /* ignore */ }
	}
}

// If there's a token saved in localStorage, attach it on init
try {
	const saved = localStorage.getItem('token');
	if (saved) setAuthToken(saved);
} catch {
	// running in non-browser environment; ignore
}

// Simple response interceptor: unwrap or centralize error handling
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Optionally handle 401 (logout) or refresh token here.
		return Promise.reject(error);
	}
);

export default axiosInstance;

