"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { EnrichedCartLine } from "@/types/cart";
import { formatIdr } from "@/lib/format-currency";
import { DollarSign, House, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import IconLinkButton from "./icon-link-button";

const outlineBrutal = "rounded-none border-black bg-cream";

const searchInputClass =
	"h-9 rounded-none border-black bg-surface pl-9 font-sans focus-visible:border-black focus-visible:ring-1 focus-visible:ring-ring/40";

type HomeNavbarProps = {
	cartLines?: EnrichedCartLine[];
	totalQuantity?: number;
	subtotal?: number;
};

export default function HomeNavbar({
	cartLines = [],
	totalQuantity = 0,
	subtotal = 0,
}: HomeNavbarProps) {
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const mobileSearchId = useId();
	const previewLines = cartLines.filter((l) => l.valid).slice(0, 8);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-black bg-primary text-cream-foreground">
			<div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					href="/home"
					className="shrink-0 font-mono font-semibold tracking-tight text-surface">
					Mock Commerce
				</Link>

				<div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3">
					<IconLinkButton href="/home" icon={House} tooltip="Go Home" />
					<div className="relative hidden min-w-0 max-w-md flex-1 sm:block">
						<Search
							className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							aria-hidden
						/>
						<Input
							placeholder="Search products…"
							className={searchInputClass}
							aria-label="Search products"
						/>
					</div>
					<Button
						type="button"
						variant="outline"
						size="default"
						className={`md:hidden ${outlineBrutal}`}
						onClick={() => setShowMobileSearch((prev) => !prev)}
						aria-expanded={showMobileSearch}
						aria-controls={mobileSearchId}
						aria-label={
							showMobileSearch ? "Close product search" : "Open product search"
						}>
						<Search />
					</Button>
					<IconLinkButton
						href="/products"
						icon={DollarSign}
						tooltip="See Products"
					/>
				</div>

				<div className="shrink-0">
					<Popover>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="outline"
									className={`relative ${outlineBrutal}`}
									aria-label="Shopping cart overview">
									<ShoppingCart className="size-4" />
									{totalQuantity > 0 ? (
										<Badge
											variant="secondary"
											className="absolute -right-2 -top-2 min-w-5 border border-black px-1 font-mono text-[10px]">
											{totalQuantity > 99 ? "99+" : totalQuantity}
										</Badge>
									) : null}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80 p-0" align="end">
								<div className="border-b border-black px-3 py-2">
									<p className="font-mono text-sm font-semibold">Your cart</p>
									<p className="text-xs text-muted-foreground">
										{totalQuantity === 0
											? "No items yet"
											: `${totalQuantity} item(s) · ${formatIdr(subtotal)}`}
									</p>
								</div>
								{previewLines.length > 0 ? (
									<ul className="max-h-64 overflow-y-auto border-b border-black">
										{previewLines.map((line) => (
											<li
												key={`${line.slug}-${line.variantId ?? ""}`}
												className="flex gap-2 border-b border-black px-3 py-2 text-xs last:border-0">
												{line.imageUrl ? (
													<img
														src={line.imageUrl}
														alt=""
														className="size-10 shrink-0 border border-black object-cover"
													/>
												) : (
													<div className="size-10 shrink-0 border border-black bg-surface" />
												)}
												<div className="min-w-0 flex-1">
													<p className="truncate font-medium text-foreground">
														{line.name}
													</p>
													{line.variantLabel ? (
														<p className="truncate text-muted-foreground">
															{line.variantLabel}
														</p>
													) : null}
													<p className="font-mono text-foreground">
														×{line.quantity} · {formatIdr(line.lineTotal)}
													</p>
												</div>
											</li>
										))}
									</ul>
								) : (
									<p className="px-3 py-6 text-center text-xs text-muted-foreground">
										Add products from the catalog.
									</p>
								)}
								<div className="flex flex-col gap-2 p-3">
									<Button
										asChild
										variant="default"
										className="w-full rounded-none border border-black">
										<Link href="/cart">View cart</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="w-full rounded-none border-black bg-surface">
										<Link href="/cart#checkout">Checkout</Link>
									</Button>
								</div>
							</PopoverContent>
						</Popover>
				</div>
			</div>

			{showMobileSearch ? (
				<div
					id={mobileSearchId}
					className="border-t border-black bg-surface py-3 text-foreground md:hidden">
					<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<div className="relative">
							<Search
								className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
								aria-hidden
							/>
							<Input
								autoFocus
								placeholder="Search products…"
								className={searchInputClass}
								aria-label="Search products"
							/>
						</div>
					</div>
				</div>
			) : null}
		</header>
	);
}
