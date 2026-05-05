"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
	CART_COOKIE_NAME,
	cookieOptions,
	normalizeCartLines,
	parseCartJson,
	serializeCartLines,
} from "@/lib/cart/cookies";
import type { CartCookieLine } from "@/lib/cart/types";
import { lineKey } from "@/lib/cart/types";

function revalidatePublic() {
	revalidatePath("/home");
	revalidatePath("/cart");
	revalidatePath("/products");
}

async function readLines(): Promise<CartCookieLine[]> {
	const jar = await cookies();
	return parseCartJson(jar.get(CART_COOKIE_NAME)?.value);
}

async function writeLines(lines: CartCookieLine[]) {
	const jar = await cookies();
	const normalized = normalizeCartLines(lines);
	jar.set(
		CART_COOKIE_NAME,
		serializeCartLines(normalized),
		cookieOptions(),
	);
	revalidatePublic();
}

export async function addToCart(
	slug: string,
	quantity: number,
	variantId?: string,
) {
	const trimmed = slug.trim();
	if (!trimmed) return { ok: false as const, error: "Invalid product" };
	const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
	const lines = await readLines();
	const key = lineKey({ slug: trimmed, variantId });
	const idx = lines.findIndex((l) => lineKey(l) === key);
	if (idx >= 0) {
		lines[idx] = {
			...lines[idx],
			quantity: lines[idx].quantity + qty,
		};
	} else {
		lines.push({
			slug: trimmed,
			variantId: variantId?.trim() || undefined,
			quantity: qty,
		});
	}
	await writeLines(lines);
	return { ok: true as const };
}

export async function removeCartLine(slug: string, variantId?: string) {
	const trimmed = slug.trim();
	const lines = await readLines();
	const key = lineKey({ slug: trimmed, variantId: variantId?.trim() || undefined });
	const next = lines.filter((l) => lineKey(l) !== key);
	await writeLines(next);
	return { ok: true as const };
}

export async function updateCartLineQuantity(
	slug: string,
	quantity: number,
	variantId?: string,
) {
	const trimmed = slug.trim();
	const qty = Math.floor(Number(quantity));
	if (!trimmed || !Number.isFinite(qty)) return { ok: false as const };
	const lines = await readLines();
	const key = lineKey({ slug: trimmed, variantId: variantId?.trim() || undefined });
	const idx = lines.findIndex((l) => lineKey(l) === key);
	if (idx < 0) return { ok: false as const };
	if (qty < 1) {
		lines.splice(idx, 1);
	} else {
		lines[idx] = { ...lines[idx], quantity: qty };
	}
	await writeLines(lines);
	return { ok: true as const };
}

export async function clearCart() {
	const jar = await cookies();
	jar.set(CART_COOKIE_NAME, serializeCartLines([]), cookieOptions());
	revalidatePublic();
	return { ok: true as const };
}
