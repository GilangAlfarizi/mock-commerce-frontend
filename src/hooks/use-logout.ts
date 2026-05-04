"use client";

import { clearSession } from "@/lib/auth-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogout() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useCallback(() => {
		clearSession();
		queryClient.clear();
		router.replace("/login");
	}, [queryClient, router]);
}
