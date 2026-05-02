/** Public category row — matches `dto.PublicCategoryDTO` in the API schema. */
export type PublicCategoryDTO = {
	id: string;
	name: string;
	slug: string;
	createdAt?: string;
};

export type PublicCategoryListResponse = {
	data: PublicCategoryDTO[];
	message: string;
};

export type PublicCategoryResponse = {
	data: PublicCategoryDTO;
	message: string;
};
