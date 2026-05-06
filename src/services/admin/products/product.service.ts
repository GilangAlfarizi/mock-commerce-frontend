import { api } from "@/services/axios";
import { IDResponse } from "@/types/admin/category";
import {
	AdminProductDTO,
	ProductCreateInput,
	ProductInput,
	ProductListResponse,
	ProductPublishInput,
	ProductResponse,
	ProductUpdateInput,
} from "@/types/admin/product";

function appendSharedFields(
	formData: FormData,
	input: ProductCreateInput | ProductUpdateInput,
): void {
	formData.append("name", input.name);
	formData.append("description", input.description);
	formData.append("price", String(input.price));
	formData.append("categoryId", input.categoryId);
	formData.append("hasVariant", String(input.hasVariant));
	if (typeof input.isActive === "boolean") {
		formData.append("isActive", String(input.isActive));
	}
	if (input.image) {
		formData.append("image", input.image);
	}
}

function toCreateFormData(input: ProductCreateInput): FormData {
	const formData = new FormData();
	appendSharedFields(formData, input);
	if (!input.hasVariant && typeof input.stock === "number") {
		formData.append("stock", String(input.stock));
	}
	return formData;
}

function toUpdateFormData(input: ProductUpdateInput): FormData {
	const formData = new FormData();
	appendSharedFields(formData, input);
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
	input: ProductCreateInput,
): Promise<ProductResponse> {
	const { data } = await api.post<ProductResponse>(
		"/admin/products",
		toCreateFormData(input),
		{
			headers: { "Content-Type": "multipart/form-data" },
		},
	);
	return data;
}

export async function updateAdminProduct(
	id: string,
	input: ProductUpdateInput,
): Promise<ProductResponse> {
	const { data } = await api.put<ProductResponse>(
		`/admin/products/${encodeURIComponent(id)}`,
		toUpdateFormData(input),
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

export async function publishAdminProduct(
	id: string,
	isActive: boolean,
): Promise<ProductResponse> {
	const body: ProductPublishInput = { isActive };
	const { data } = await api.patch<ProductResponse>(
		`/admin/products/${encodeURIComponent(id)}/publish`,
		body,
	);
	return data;
}

export type {
	AdminProductDTO,
	ProductCreateInput,
	ProductInput,
	ProductUpdateInput,
};
