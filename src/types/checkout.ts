/** Matches `dto.PublicOrderItemInput`. */
export type PublicOrderItemInput = {
	productId: string;
	quantity: number;
	variantId?: string;
};

/** Matches `dto.PublicOrderInput`. */
export type PublicOrderInput = {
	customerEmail: string;
	customerName: string;
	customerPhone?: string;
	items: PublicOrderItemInput[];
	shippingAddress: string;
	shippingCity: string;
	shippingPostalCode: string;
};

/** Matches `dto.MidtransCheckout`. */
export type MidtransCheckout = {
	redirect_url: string;
	token: string;
};

export type PublicCheckoutResponse = {
	data: MidtransCheckout;
	message: string;
};
