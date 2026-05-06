"use client";

import {
	createAdminVariant,
	deleteAdminVariant,
	listAdminVariants,
	updateAdminVariant,
} from "@/services/admin/variants";
import type { VariantInput, VariantListResponse } from "@/types/admin/variant";
import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useAuthSession } from "./use-auth-session";
import { adminProductsQueryKey } from "./use-admin-products";
import { adminProductQueryKey } from "./use-admin-product";

export function adminVariantsQueryKey(productId: string) {
	return ["admin", "variants", productId] as const;
}

export function useAdminVariants(
	productId: string | undefined,
): UseQueryResult<VariantListResponse, Error> {
	const { status } = useAuthSession();

	return useQuery({
		queryKey: adminVariantsQueryKey(productId ?? ""),
		queryFn: () => listAdminVariants(productId!),
		enabled: status === "authenticated" && Boolean(productId),
	});
}

function invalidateVariantScopes(
	queryClient: ReturnType<typeof useQueryClient>,
	productId: string,
) {
	void queryClient.invalidateQueries({
		queryKey: adminVariantsQueryKey(productId),
	});
	void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
	void queryClient.invalidateQueries({
		queryKey: adminProductQueryKey(productId),
	});
}

export function useCreateAdminVariant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			input,
		}: {
			productId: string;
			input: VariantInput;
		}) => createAdminVariant(productId, input),
		onSuccess: (_, variables) => {
			invalidateVariantScopes(queryClient, variables.productId);
		},
	});
}

export function useUpdateAdminVariant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			variantId,
			input,
		}: {
			productId: string;
			variantId: string;
			input: VariantInput;
		}) => updateAdminVariant(productId, variantId, input),
		onSuccess: (_, variables) => {
			invalidateVariantScopes(queryClient, variables.productId);
		},
	});
}

export function useDeleteAdminVariant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			variantId,
		}: {
			productId: string;
			variantId: string;
		}) => deleteAdminVariant(productId, variantId),
		onSuccess: (_, variables) => {
			invalidateVariantScopes(queryClient, variables.productId);
		},
	});
}
