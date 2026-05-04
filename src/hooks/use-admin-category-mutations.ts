"use client";

import {
	createAdminCategory,
	deleteAdminCategory,
	updateAdminCategory,
} from "@/services/admin/categories";
import type { CategoryInput } from "@/types/admin/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoriesQueryKey } from "./use-admin-categories";

export function useCreateAdminCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CategoryInput) => createAdminCategory(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminCategoriesQueryKey });
		},
	});
}

export function useUpdateAdminCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: CategoryInput }) =>
			updateAdminCategory(id, input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminCategoriesQueryKey });
		},
	});
}

export function useDeleteAdminCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteAdminCategory(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminCategoriesQueryKey });
		},
	});
}
