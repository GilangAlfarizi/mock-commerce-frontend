/** Admin product types — fill when implementing `src/services/admin/products`. */

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
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isActive: boolean;
  image?: File;
}

export type ProductResponse = {
	data: AdminProductDTO;
	message: string;
};

export type ProductListResponse = {
	data: AdminProductDTO[];
	message: string;
};
