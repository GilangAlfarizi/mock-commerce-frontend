/** Admin category DTOs — mirrors `docs/swagger.json` `dto.Category*`. */

export type AdminCategoryDTO = {
	id: string;
	name: string;
	slug: string;
	createdAt?: string;
	updatedAt?: string;
};

export type CategoryInput = {
	name: string;
};

export type CategoryResponse = {
	data: AdminCategoryDTO;
	message: string;
};

export type CategoryListResponse = {
	data: AdminCategoryDTO[];
	message: string;
};

export type IDData = {
	id: string;
};

export type IDResponse = {
	data: IDData;
	message: string;
};
