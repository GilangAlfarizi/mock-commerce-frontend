"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { House, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

const outlineBrutal =
	"rounded-none border-black bg-cream text-foreground shadow-none hover:bg-surface hover:text-foreground";

export default function HomeNavbar() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-black bg-primary text-cream-foreground">
			<div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					href="/home"
					className="shrink-0 font-mono  font-semibold tracking-tight text-surface">
					Mock Commerce
				</Link>

				<div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3">
					<Button
						variant="outline"
						size="default"
						className={outlineBrutal}
						asChild>
						<Link href="/home">
							<House />
						</Link>
					</Button>
					<div className="relative min-w-0 max-w-md flex-1">
						<Search
							className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							aria-hidden
						/>
						<Input
							placeholder="Search products…"
							className="h-9 rounded-none border-black bg-surface pl-9 font-sans focus-visible:border-black focus-visible:ring-1 focus-visible:ring-ring/40"
							aria-label="Search products"
						/>
					</div>
					<Button
						variant="outline"
						size="default"
						className={outlineBrutal}
						asChild>
						<Link href="/products">See Products</Link>
					</Button>
				</div>

				<div className="shrink-0">
					<Button
						variant="outline"
						size="icon"
						className={`${outlineBrutal} size-9`}
						asChild>
						<Link href="/cart" aria-label="Cart">
							<ShoppingCart className="size-4" />
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
