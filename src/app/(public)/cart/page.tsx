import CartCheckoutClient from "@/features/public/components/cart/cart-checkout-client";
import CartLinesClient from "@/features/public/components/cart/cart-lines-client";
import { cartTotals, enrichCartLines } from "@/lib/cart/enrich-cart";
import { getCartLines } from "@/lib/cart/get-cart";
import { formatIdr } from "@/lib/format-currency";

export const metadata = {
	title: "Cart | Mock Commerce",
};

export default async function CartPage() {
	const rawLines = await getCartLines();
	const lines = await enrichCartLines(rawLines);
	const { subtotal, count } = cartTotals(lines);
	const validLines = lines.filter((l) => l.valid);

	return (
		<div className="space-y-10">
			<div className="space-y-2">
				<h1 className="font-mono text-3xl font-semibold tracking-tight">Cart</h1>
				<p className="text-sm text-muted-foreground">
					{count === 0
						? "No items yet."
						: `${count} item(s) — ${formatIdr(subtotal)} before shipping.`}
				</p>
			</div>

			<section className="space-y-3">
				<h2 className="sr-only">Items</h2>
				<CartLinesClient lines={lines} />
			</section>

			<CartCheckoutClient validLines={validLines} subtotal={subtotal} />
		</div>
	);
}
