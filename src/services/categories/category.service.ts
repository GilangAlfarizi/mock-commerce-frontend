import { api } from "@/services/axios";
import type {
	PublicCategoryListResponse,
	PublicCategoryResponse,
} from "@/types/category";

export async function listCategories(): Promise<PublicCategoryListResponse> {
	const { data } = await api.get<PublicCategoryListResponse>("/categories");
	return data;
}

export async function getCategoryBySlug(
	slug: string,
): Promise<PublicCategoryResponse> {
	const { data } = await api.get<PublicCategoryResponse>(
		`/categories/${encodeURIComponent(slug)}`,
	);
	return data;
}
