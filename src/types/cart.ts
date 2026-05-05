/** Line with resolved product data (SSR / server). */
export type EnrichedCartLine = {
	slug: string;
	variantId?: string;
	quantity: number;
	productId: string;
	name: string;
	imageUrl: string;
	unitPrice: number;
	lineTotal: number;
	variantLabel: string | null;
	valid: boolean;
	error: string | null;
};
