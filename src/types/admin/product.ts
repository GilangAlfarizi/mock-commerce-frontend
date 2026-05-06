/** Admin product types — mirrors `docs/swagger.json` `dto.Product*`. */

export type AdminProductDTO = {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	imageUrl: string;
	imageFileId: string;
	categoryId: string;
	categoryName: string;
	categorySlug: string;
	hasVariant: boolean;
	totalStock: number;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type ProductCreateInput = {
	name: string;
	description: string;
	price: number;
	categoryId: string;
	hasVariant: boolean;
	/** Required only when `hasVariant === false`. */
	stock?: number;
	isActive?: boolean;
	image?: File;
};

export type ProductUpdateInput = {
	name: string;
	description: string;
	price: number;
	categoryId: string;
	hasVariant: boolean;
	isActive?: boolean;
	image?: File;
};

/** Convenience union used by the form dialog. */
export type ProductInput = ProductCreateInput;

export type ProductPublishInput = {
	isActive: boolean;
};

export type ProductResponse = {
	data: AdminProductDTO;
	message: string;
};

export type ProductListResponse = {
	data: AdminProductDTO[];
	message: string;
};
