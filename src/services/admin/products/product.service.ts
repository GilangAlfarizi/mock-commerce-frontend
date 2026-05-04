import { api } from "@/services/axios";
import { IDResponse } from "@/types/admin/category";
import {
	AdminProductDTO,
	ProductInput,
	ProductListResponse,
	ProductResponse,
} from "@/types/admin/product";

function toProductFormData(input: ProductInput): FormData {
	const formData = new FormData();
	formData.append("name", input.name);
	formData.append("description", input.description);
	formData.append("price", String(input.price));
	formData.append("categoryId", input.categoryId);
	formData.append("isActive", String(input.isActive));
	if (input.image) {
		formData.append("image", input.image);
	}
	return formData;
}

export async function listAdminProducts(): Promise<ProductListResponse> {
	const { data } = await api.get<ProductListResponse>("/admin/products");
	return data;
}

export async function getAdminProduct(id: string): Promise<ProductResponse> {
	const { data } = await api.get<ProductResponse>(
		`/admin/products/${encodeURIComponent(id)}`,
	);
	return data;
}

export async function createAdminProduct(
	input: ProductInput,
): Promise<ProductResponse> {
	const { data } = await api.post<ProductResponse>(
		"/admin/products",
		toProductFormData(input),
		{
			headers: { "Content-Type": "multipart/form-data" },
		},
	);
	return data;
}

export async function updateAdminProduct(
	id: string,
	input: ProductInput,
): Promise<ProductResponse> {
	const { data } = await api.put<ProductResponse>(
		`/admin/products/${encodeURIComponent(id)}`,
		toProductFormData(input),
		{
			headers: { "Content-Type": "multipart/form-data" },
		},
	);
	return data;
}

export async function deleteAdminProduct(id: string): Promise<IDResponse> {
	const { data } = await api.delete<IDResponse>(
		`/admin/products/${encodeURIComponent(id)}`,
	);
	return data;
}

export type { AdminProductDTO, ProductInput };
