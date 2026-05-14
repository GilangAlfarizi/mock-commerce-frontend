"use client";

import { ProductCardProps } from "@/types/product";
import { cn, toCurrency } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SearchCode } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductCard({
	id,
	slug,
	name,
	description,
	price,
	categoryName,
	imageUrl,
}: ProductCardProps) {
	return (
		<div className="relative h-full">
			<div className="absolute inset-0 bg-primary" />

			<motion.article
				key={id}
				whileHover={{ x: 5, y: -5 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
				className="relative flex h-full flex-col border border-black bg-surface p-3">
				<img
					src={imageUrl}
					alt={imageUrl}
					className="aspect-square border border-black bg-secondary"
				/>
				<div className="mt-3 flex flex-1 flex-col space-y-2">
					<p className="inline-flex border border-black bg-cream px-2 py-0.5 text-xs">
						{categoryName}
					</p>
					<h3 className="font-mono text-base font-semibold leading-tight">
						{name}
					</h3>
					<p className="line-clamp-2 text-xs text-muted-foreground">
						{description}
					</p>
					<div className="mt-auto flex items-center justify-between gap-2 pt-4">
						<p className="min-w-0 text-sm font-semibold">{toCurrency(price)}</p>
						<Link
							href={`/products/${slug}`}
							className={cn(
								buttonVariants({ variant: "outline", size: "default" }),
								"rounded-none border-black bg-cream",
							)}
							title="Detail"
							aria-label={`Product detail: ${name}`}>
							<SearchCode className="size-4" aria-hidden />
						</Link>
					</div>
				</div>
				{/* </article> */}
			</motion.article>
		</div>
	);
}
