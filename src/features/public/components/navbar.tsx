"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, House, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import IconLinkButton from "./icon-link-button";

const outlineBrutal = "rounded-none border-black bg-cream";

const searchInputClass =
	"h-9 rounded-none border-black bg-surface pl-9 font-sans focus-visible:border-black focus-visible:ring-1 focus-visible:ring-ring/40";

export default function HomeNavbar() {
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const mobileSearchId = useId();

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
					<IconLinkButton
						href="/cart"
						icon={ShoppingCart}
						tooltip="Your Cart"
					/>
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
