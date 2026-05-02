import { ProductCardProps } from "@/types/product";
import { toCurrency } from "@/lib/utils";
import { SearchCode } from "lucide-react";
import IconLinkButton from "./icon-link-button";

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
		<article
			key={id}
			className="flex h-full flex-col border border-black bg-surface p-3">
			{/* <div className="aspect-4/5 border border-black bg-secondary" /> */}
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
				<div className="mt-auto flex items-center justify-between pt-4">
					<p className="text-sm font-semibold">{toCurrency(price)}</p>
					<IconLinkButton
						href={`/products/${slug}`}
						icon={SearchCode}
						tooltip="Detail"
						side="left"
					/>
				</div>
			</div>
		</article>
	);
}
