import { api } from "@/services/axios";
import type { PublicCheckoutResponse, PublicOrderInput } from "@/types/checkout";

export async function postCheckout(
	body: PublicOrderInput,
): Promise<PublicCheckoutResponse> {
	const { data } = await api.post<PublicCheckoutResponse>("/checkout", body);
	return data;
}
