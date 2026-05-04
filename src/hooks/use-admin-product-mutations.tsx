"use client";

import {
	createAdminProduct,
	deleteAdminProduct,
	updateAdminProduct,
} from "@/services/admin/products";
import { ProductInput } from "@/types/admin/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsQueryKey } from "./use-admin-products";

export function useCreateAdminProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: ProductInput) => createAdminProduct(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
		},
	});
}

export function useUpdateAdminProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
			updateAdminProduct(id, input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
		},
	});
}

export function useDeleteAdminProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteAdminProduct(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
		},
	});
}
