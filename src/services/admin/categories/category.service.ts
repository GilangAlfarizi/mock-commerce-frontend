import { api } from "@/services/axios";
import type {
	AdminCategoryDTO,
	CategoryInput,
	CategoryListResponse,
	CategoryResponse,
	IDResponse,
} from "@/types/admin/category";

export async function listAdminCategories(): Promise<CategoryListResponse> {
	const { data } = await api.get<CategoryListResponse>("/admin/categories");
	return data;
}

export async function getAdminCategory(id: string): Promise<CategoryResponse> {
	const { data } = await api.get<CategoryResponse>(
		`/admin/categories/${encodeURIComponent(id)}`,
	);
	return data;
}

export async function createAdminCategory(input: CategoryInput): Promise<CategoryResponse> {
	const { data } = await api.post<CategoryResponse>("/admin/categories", input);
	return data;
}

export async function updateAdminCategory(
	id: string,
	input: CategoryInput,
): Promise<CategoryResponse> {
	const { data } = await api.put<CategoryResponse>(
		`/admin/categories/${encodeURIComponent(id)}`,
		input,
	);
	return data;
}

export async function deleteAdminCategory(id: string): Promise<IDResponse> {
	const { data } = await api.delete<IDResponse>(
		`/admin/categories/${encodeURIComponent(id)}`,
	);
	return data;
}

export type { AdminCategoryDTO, CategoryInput };
