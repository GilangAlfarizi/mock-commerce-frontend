import PublicFooter from "@/features/public/components/footer";
import HomeNavbar from "@/features/public/components/navbar";
import { cartTotals, enrichCartLines } from "@/lib/cart/enrich-cart";
import { getCartLines } from "@/lib/cart/get-cart";
import type { ReactNode } from "react";

export default async function PublicLayout({ children }: { children: ReactNode }) {
	const rawLines = await getCartLines();
	const enrichedLines = await enrichCartLines(rawLines);
	const { subtotal, count } = cartTotals(enrichedLines);

	return (
		<>
			<HomeNavbar
				cartLines={enrichedLines}
				totalQuantity={count}
				subtotal={subtotal}
			/>
			<main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
				{children}
			</main>
			<PublicFooter />
		</>
	);
}
