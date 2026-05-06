/** Admin variant types — mirrors `docs/swagger.json` `dto.ProductVariant*`. */

export type AdminVariantDTO = {
	id: string;
	productId: string;
	sku: string;
	size: string;
	color: string;
	price: number;
	stock: number;
	createdAt?: string;
	updatedAt?: string;
};

export type VariantInput = {
	sku: string;
	size?: string;
	color?: string;
	price: number;
	stock: number;
};

export type VariantResponse = {
	data: AdminVariantDTO;
	message: string;
};

export type VariantListResponse = {
	data: AdminVariantDTO[];
	message: string;
};
