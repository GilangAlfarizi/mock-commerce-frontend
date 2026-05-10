/** Admin + shared order DTOs — aligned with `docs/swagger.json` `dto.Order*`. */

export type AdminOrderDTO = {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	paymentStatus: string;
	status: string;
	totalPrice: number;
	createdAt?: string;
	updatedAt?: string;
};

export type OrderListResponse = {
	data: AdminOrderDTO[];
	message: string;
};

export type AdminOrderItemDTO = {
	id: string;
	productName: string;
	quantity: number;
	totalPrice: number;
	variantColor?: string;
	variantSKU?: string;
	variantSize?: string;
};

/** `dto.OrderDetailDTO` — also used for public tracking when shapes match. */
export type AdminOrderDetailDTO = {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	paymentStatus: string;
	status: string;
	totalPrice: number;
	courier?: string;
	trackingNumber?: string;
	shippingAddress?: string;
	shippingCity?: string;
	shippingPostalCode?: string;
	shippedAt?: string;
	deliveredAt?: string;
	createdAt?: string;
	updatedAt?: string;
	items?: AdminOrderItemDTO[];
};

export type OrderDetailUpdateInput = {
	status: OrderDetailPatchStatus;
	courier?: string;
	trackingNumber?: string;
};

/** Allowed values on `PATCH .../order-detail` per Swagger. */
export type OrderDetailPatchStatus =
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";

export type CustomerDetailUpdateInput = {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
};

export type ShippingDetailUpdateInput = {
	shippingAddress: string;
	shippingCity: string;
	shippingPostalCode: string;
};
