import type { CartCookieLine } from "@/lib/cart/types";
import { lineKey } from "@/lib/cart/types";

export const CART_COOKIE_NAME = "mock_commerce_cart";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 60; // 60 days

export function parseCartJson(raw: string | undefined): CartCookieLine[] {
	if (!raw?.trim()) return [];
	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		const lines: CartCookieLine[] = [];
		for (const row of parsed) {
			if (!row || typeof row !== "object") continue;
			const o = row as Record<string, unknown>;
			const slug = typeof o.slug === "string" ? o.slug.trim() : "";
			const quantity = Number(o.quantity);
			if (!slug || !Number.isFinite(quantity) || quantity < 1) continue;
			const variantId =
				typeof o.variantId === "string" && o.variantId.trim()
					? o.variantId.trim()
					: undefined;
			lines.push({ slug, variantId, quantity: Math.floor(quantity) });
		}
		return normalizeCartLines(lines);
	} catch {
		return [];
	}
}

/** Merge duplicate slug+variant rows and drop invalid quantities. */
export function normalizeCartLines(lines: CartCookieLine[]): CartCookieLine[] {
	const map = new Map<string, CartCookieLine>();
	for (const line of lines) {
		const key = lineKey(line);
		const existing = map.get(key);
		if (existing) {
			existing.quantity += line.quantity;
		} else {
			map.set(key, { ...line });
		}
	}
	return [...map.values()].filter((l) => l.quantity > 0);
}

export function serializeCartLines(lines: CartCookieLine[]): string {
	return JSON.stringify(normalizeCartLines(lines));
}

export function cookieOptions() {
	return {
		path: "/" as const,
		maxAge: MAX_AGE_SECONDS,
		sameSite: "lax" as const,
		httpOnly: false,
	};
}
