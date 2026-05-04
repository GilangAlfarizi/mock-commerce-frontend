import type { UserDTO } from "@/types/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AUTH_STORAGE_EVENT = "mock-commerce-auth-storage";

function dispatchAuthEvent() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function getToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): UserDTO | null {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as UserDTO;
	} catch {
		return null;
	}
}

export function setSession(token: string, user: UserDTO) {
	if (typeof window === "undefined") return;
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_KEY, JSON.stringify(user));
	dispatchAuthEvent();
}

export function clearSession() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
	dispatchAuthEvent();
}
