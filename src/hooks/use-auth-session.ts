"use client";

import { AUTH_STORAGE_EVENT, getToken, getUser } from "@/lib/auth-storage";
import type { UserDTO } from "@/types/auth";
import { useSyncExternalStore } from "react";

export type AuthSessionState =
	| { status: "loading"; token: null; user: null }
	| { status: "authenticated"; token: string; user: UserDTO }
	| { status: "unauthenticated"; token: null; user: null };

/** Stable snapshot for SSR / `getServerSnapshot` — must be referentially stable (React requirement). */
const SERVER_SNAPSHOT: AuthSessionState = {
	status: "loading",
	token: null,
	user: null,
};

/** Stable snapshot when there is no session (client). */
const UNAUTHENTICATED_SNAPSHOT: AuthSessionState = {
	status: "unauthenticated",
	token: null,
	user: null,
};

type SessionCache = {
	snapshot: AuthSessionState;
	fingerprint: string;
};

let clientCache: SessionCache | null = null;

function sessionFingerprint(token: string | null, user: UserDTO | null): string {
	if (!token || !user) return `none:${token ?? ""}`;
	return `${token}:${user.id}:${user.email}:${user.role}`;
}

function readSession(): AuthSessionState {
	if (typeof window === "undefined") {
		return SERVER_SNAPSHOT;
	}

	const token = getToken();
	const user = getUser();
	const fingerprint = sessionFingerprint(token, user);

	if (clientCache && clientCache.fingerprint === fingerprint) {
		return clientCache.snapshot;
	}

	if (token && user) {
		const snapshot: AuthSessionState = { status: "authenticated", token, user };
		clientCache = { snapshot, fingerprint };
		return snapshot;
	}

	clientCache = { snapshot: UNAUTHENTICATED_SNAPSHOT, fingerprint };
	return UNAUTHENTICATED_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
	if (typeof window === "undefined") {
		return () => {};
	}
	const handler = () => {
		clientCache = null;
		onStoreChange();
	};
	window.addEventListener("storage", handler);
	window.addEventListener(AUTH_STORAGE_EVENT, handler);
	return () => {
		window.removeEventListener("storage", handler);
		window.removeEventListener(AUTH_STORAGE_EVENT, handler);
	};
}

function getServerSnapshot(): AuthSessionState {
	return SERVER_SNAPSHOT;
}

export function useAuthSession(): AuthSessionState {
	return useSyncExternalStore(subscribe, readSession, getServerSnapshot);
}
