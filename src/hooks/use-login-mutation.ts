"use client";

import { login } from "@/services/auth";
import { setSession } from "@/lib/auth-storage";
import type { LoginInput } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: LoginInput) => login(input),
		onSuccess: (res) => {
			const { token, user } = res.data;
			setSession(token, user);
			queryClient.clear();
			router.replace("/admin/categories");
		},
	});
}
