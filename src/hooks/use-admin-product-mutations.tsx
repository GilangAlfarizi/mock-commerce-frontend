"use client";

import {
	createAdminProduct,
	deleteAdminProduct,
	publishAdminProduct,
	updateAdminProduct,
} from "@/services/admin/products";
import type {
	ProductCreateInput,
	ProductUpdateInput,
} from "@/types/admin/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsQueryKey } from "./use-admin-products";
import { adminProductQueryKey } from "./use-admin-product";

export function useCreateAdminProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: ProductCreateInput) => createAdminProduct(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
		},
	});
}

export function useUpdateAdminProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: ProductUpdateInput }) =>
			updateAdminProduct(id, input),
		onSuccess: (_, variables) => {
			void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
			void queryClient.invalidateQueries({
				queryKey: adminProductQueryKey(variables.id),
			});
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

export function usePublishAdminProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			publishAdminProduct(id, isActive),
		onSuccess: (_, variables) => {
			void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
			void queryClient.invalidateQueries({
				queryKey: adminProductQueryKey(variables.id),
			});
		},
	});
}
