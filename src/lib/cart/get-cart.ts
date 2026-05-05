import { cookies } from "next/headers";
import {
	CART_COOKIE_NAME,
	parseCartJson,
} from "@/lib/cart/cookies";
import type { CartCookieLine } from "@/lib/cart/types";

export async function getCartLines(): Promise<CartCookieLine[]> {
	const jar = await cookies();
	const raw = jar.get(CART_COOKIE_NAME)?.value;
	return parseCartJson(raw);
}
