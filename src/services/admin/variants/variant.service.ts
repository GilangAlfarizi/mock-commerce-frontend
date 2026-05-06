import { api } from "@/services/axios";
import type { IDResponse } from "@/types/admin/category";
import type {
	VariantInput,
	VariantListResponse,
	VariantResponse,
} from "@/types/admin/variant";

export async function listAdminVariants(
	productId: string,
): Promise<VariantListResponse> {
	const { data } = await api.get<VariantListResponse>(
		`/admin/products/${encodeURIComponent(productId)}/variants`,
	);
	return data;
}

export async function createAdminVariant(
	productId: string,
	input: VariantInput,
): Promise<VariantResponse> {
	const { data } = await api.post<VariantResponse>(
		`/admin/products/${encodeURIComponent(productId)}/variants`,
		input,
	);
	return data;
}

export async function updateAdminVariant(
	productId: string,
	variantId: string,
	input: VariantInput,
): Promise<VariantResponse> {
	const { data } = await api.put<VariantResponse>(
		`/admin/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(
			variantId,
		)}`,
		input,
	);
	return data;
}

export async function deleteAdminVariant(
	productId: string,
	variantId: string,
): Promise<IDResponse> {
	const { data } = await api.delete<IDResponse>(
		`/admin/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(
			variantId,
		)}`,
	);
	return data;
}
