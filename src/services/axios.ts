import axios from "axios";
import { clearSession, getToken } from "@/lib/auth-storage";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 15_000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const path = config.url ?? "";
		const isPublicAuth =
			path === "/login" || path === "/register" || path.endsWith("/login") || path.endsWith("/register");
		const token = getToken();
		if (token && !isPublicAuth) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

api.interceptors.response.use(
	(res) => res,
	(error) => {
		if (typeof window === "undefined") return Promise.reject(error);
		const status = axios.isAxiosError(error) ? error.response?.status : undefined;
		if (status === 401) {
			const path = axios.isAxiosError(error) ? error.config?.url ?? "" : "";
			const isLoginAttempt =
				path === "/login" || path === "/register" || path.endsWith("/login") || path.endsWith("/register");
			if (!isLoginAttempt) {
				clearSession();
				window.location.assign("/login");
			}
		}
		return Promise.reject(error);
	},
);
